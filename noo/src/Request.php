<?php
class Request
{
    private $get;
    private $post;
    private const DEFAULT_MIN = 1;
    private const DEFAULT_MAX = 10000;
    private const MIN_ITEMS = 1;
    private const MAX_ITEMS = 1000;

    public function __construct(array $get, array $post)
    {
        $this->get = $get;
        $this->post = $post;
    }

    public function getInt(string $key, int $default = null): ?int
    {
        $value = $this->get[$key] ?? $this->post[$key] ?? null;

        if ($value === null) {
            return $default;
        }

        $filtered = filter_var($value, FILTER_VALIDATE_INT);

        return $filtered !== false ? $filtered : $default;
    }

    public function validate(): array
    {
        $errors = [];
        $data = [];

        $n = $this->getInt('n');

        if ($n === null) {
            $errors['n'] = 'El campo N es requerido';
        } elseif ($n < self::MIN_ITEMS || $n > self::MAX_ITEMS) {
            $errors['n'] = 'N debe estar entre ' . self::MIN_ITEMS . ' y ' . self::MAX_ITEMS;
        } else {
            $data['n'] = $n;
        }

        $min = $this->getInt('min', self::DEFAULT_MIN);
        $max = $this->getInt('max', self::DEFAULT_MAX);

        if ($min !== null && $max !== null && $min >= $max) {
            $errors['range'] = 'El valor mínimo debe ser menor que el máximo';
        } else {
            $data['min'] = $min ?? self::DEFAULT_MIN;
            $data['max'] = $max ?? self::DEFAULT_MAX;
        }

        return ['errors' => $errors, 'data' => $data];
    }

    public function all(): array
    {
        return [
            'get' => $this->get,
            'post' => $this->post
        ];
    }
}
