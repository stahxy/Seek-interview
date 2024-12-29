import type { Config } from "jest";
import nextJest from "next/jest.js";

// Configuramos nextJest primero
const createJestConfig = nextJest({
	// Ruta a tu aplicación Next.js
	dir: "./",
});

// Configuración personalizada de Jest
const config: Config = {
	coverageProvider: "v8",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	preset: "ts-jest",

	// Agregamos la configuración necesaria para resolver los alias
	moduleNameMapper: {
		// Esto mapea el alias @/ a la carpeta src/
		"^@/(.*)$": "<rootDir>/src/$1",
	},

	// Especificamos dónde buscar los archivos de prueba
	roots: ["<rootDir>/src"],

	// Patrones de archivos de prueba
	testMatch: [
		"**/__tests__/**/*.+(ts|tsx|js)",
		"**/?(*.)+(spec|test).+(ts|tsx|js)",
	],

	// Transformaciones para TypeScript
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
			},
		],
	},
};

// Exportamos la configuración
export default createJestConfig(config);
