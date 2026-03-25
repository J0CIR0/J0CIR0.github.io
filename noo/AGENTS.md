## agents.md

### Resumen
Aplicación PHP orientada a objetos que solicita N elementos y muestra N números aleatorios en una tabla. Punto de entrada: html/noo/index.php. Sin Composer (todo con require_once).

### Entorno Docker
```yaml
services:
  web:
    image: php:7.4-apache
    ports:
      - "8082:80"
    volumes:
      - ./html:/var/www/html
    restart: always
```

### Estructura de archivos
- `index.php` — Front controller con session_start()
- `src/App.php` — Coordina flujo PRG
- `src/Request.php` — Maneja y valida entrada HTTP
- `src/RandomGenerator.php` — Genera números aleatorios
- `src/Renderer.php` — Renderiza vistas y escapa salidas
- `views/form.php` — Formulario HTML
- `views/results.php` — Tabla de resultados

### Reglas de diseño (obligatorias)
- OOP: cada responsabilidad en su clase
- No usar: bucles infinitos, switch, break
- Validación: n entero entre 1 y 1000
- PRG (Post/Redirect/Get) con sesiones
- Escapar salida: htmlspecialchars($str, ENT_QUOTES, 'UTF-8')
- PHP 7.4 compatible (evitar sintaxis 8+)

---

## Build, Lint y Test Commands

### Verificación de sintaxis
```bash
# Verificar un archivo
php -l index.php
php -l src/Request.php

# Verificar todos los archivos
find . -name "*.php" -exec php -l {} \;

# Verificar respuesta del servidor
curl -s http://localhost:8082/noo/ | head -20
```

### Docker
```bash
docker-compose up -d
docker-compose logs -f web
docker-compose exec web bash
docker-compose restart
```

---

## Guías de Estilo de Código

### Convenciones generales
- PHP 7.4: sin propiedades tipadas, match expression, etc.
- Fin de línea: LF (Unix), codificación: UTF-8

### Imports
- `require_once __DIR__ . '/src/Request.php'`
- No usar Composer ni autoload

### Formateo
- Sangría: 4 espacios
- Llaves de apertura en línea nueva para clases/funciones
- Líneas máximo 120 caracteres
- Operadores rodeados por espacios: `$a + $b`

### Tipos
- Type hints: `: int`, `: float`, `: string`, `: array`, `: void`
- Nullable: `: ?int`, `: ?string`

### Nombres
- Clases: PascalCase (`App`, `Request`)
- Métodos: camelCase (`getInt`, `renderForm`)
- Variables: camelCase (`$numbers`, `$data`)
- Constantes: UPPER_CASE (`MAX_ITEMS`, `DEFAULT_MIN`)
- Archivos: matching clase (`Request.php` → `class Request`)

### Manejo de errores
- Validar entrada en Request::validate()
- Devolver array: `['errors' => [], 'data' => []]`
- Usar filter_var() para validación
- Sanitizar salida: htmlspecialchars($str, ENT_QUOTES, 'UTF-8')

### Patrones a evitar
- NO: bucles infinitos, switch, break, eval(), exec(), goto

### Estructura de clase
```php
<?php
class NombreClase
{
    private $propiedad;
    private const CONSTANTE = valor;

    public function __construct(Tipo $param)
    {
        $this->propiedad = $param;
    }

    public function metodoPublico(Tipo $arg): TipoRetorno
    {
        return $this->propiedad;
    }
}
```

### Contratos de las clases

**Request.php**
- `__construct(array $get, array $post)`
- `getInt(string $key, int $default = null): ?int`
- `validate(): array` — devuelve `['errors' => [], 'data' => []]`
- `all(): array`
- Validar 'n' entre 1 y 1000; 'min' y 'max' opcionales con min < max

**RandomGenerator.php**
- `__construct(int $n, int $min = 1, int $max = 10000)`
- `generate(): array` — devuelve array de números
- `getSum(): int`, `getAverage(): float`, `getMin(): int`, `getMax(): int`
- Usar `random_int($min, $max)` para aleatoriedad

**Renderer.php**
- `renderForm(array $data = []): string`
- `renderResults(array $numbers, array $stats, array $previousInput = []): string`
- Incluir vistas con rutas relativas

**App.php**
- `__construct(Request $req, Renderer $renderer)`
- `run(): void` — coordina flujo PRG
- Si POST: validar, generar, guardar en $_SESSION, redirigir
- Si GET: cargar desde $_SESSION, renderizar, limpiar sesión

### index.php
```php
<?php
session_start();

require_once __DIR__ . '/src/Request.php';
require_once __DIR__ . '/src/RandomGenerator.php';
require_once __DIR__ . '/src/Renderer.php';
require_once __DIR__ . '/src/App.php';

$request = new Request($_GET, $_POST);
$renderer = new Renderer();
$app = new App($request, $renderer);
$app->run();
```

### Comentarios
- Breves en secciones clave
- PHPDoc en métodos públicos si hay complejidad
- Evitar comentarios obvios

--- End of agents.md
