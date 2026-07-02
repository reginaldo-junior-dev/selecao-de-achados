package com.selecaodeachados.bd_selecao_de_achados;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.net.URI;

@SpringBootApplication
public class BdSelecaoDeAchadosApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(entry -> {
			if (System.getProperty(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});

		String databaseUrl = System.getenv("DATABASE_URL");
		if (databaseUrl != null && !databaseUrl.isBlank()) {
			try {
				URI uri = new URI(databaseUrl);
				String userInfo = uri.getUserInfo();
				if (userInfo != null && userInfo.contains(":")) {
					String[] parts = userInfo.split(":", 2);
					String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath()
							+ "?sslmode=require";

					if (System.getProperty("spring.datasource.url") == null) {
						System.setProperty("spring.datasource.url", jdbcUrl);
					}
					if (System.getProperty("spring.datasource.username") == null) {
						System.setProperty("spring.datasource.username", parts[0]);
					}
					if (System.getProperty("spring.datasource.password") == null) {
						System.setProperty("spring.datasource.password", parts[1]);
					}
				}
			} catch (Exception e) {
				System.err.println("Falha ao parsear DATABASE_URL: " + e.getMessage());
			}
		}

		SpringApplication.run(BdSelecaoDeAchadosApplication.class, args);
	}

}
