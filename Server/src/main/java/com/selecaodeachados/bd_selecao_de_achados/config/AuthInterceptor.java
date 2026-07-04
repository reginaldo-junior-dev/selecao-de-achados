package com.selecaodeachados.bd_selecao_de_achados.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    private static final Set<String> PUBLIC_PREFIXES = Set.of("/api/auth/", "/api/cliques/");
    private static final Set<String> PUBLIC_METHODS = Set.of("GET", "OPTIONS", "HEAD");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String method = request.getMethod();
        String path = request.getRequestURI();

        // OPTIONS sempre liberado (CORS preflight)
        if ("OPTIONS".equals(method)) {
            return true;
        }

        // Rotas publicas liberadas independente do metodo
        for (String prefix : PUBLIC_PREFIXES) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }

        // Metodos seguros (GET, HEAD) liberados para qualquer rota nao-admin
        if (PUBLIC_METHODS.contains(method) && !path.startsWith("/api/admin/")) {
            return true;
        }

        // Demais casos: exige token Bearer valido
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.validarToken(token);

        if (email == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        request.setAttribute("adminEmail", email);
        return true;
    }
}
