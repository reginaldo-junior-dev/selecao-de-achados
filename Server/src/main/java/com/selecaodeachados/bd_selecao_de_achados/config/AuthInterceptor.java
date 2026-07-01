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

    private static final Set<String> PUBLIC_METHODS = Set.of("GET", "OPTIONS");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String method = request.getMethod();
        String path = request.getRequestURI();

        if ("OPTIONS".equals(method) || path.startsWith("/api/auth/") || path.startsWith("/api/cliques/")) {
            return true;
        }

        boolean isAdminPath = path.startsWith("/api/admin/");

        if (!isAdminPath && "GET".equals(method)) {
            return true;
        }

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
