<?php
class RandomGenerator
{
    private $n;
    private $min;
    private $max;
    private $numbers = [];

    public function __construct(int $n, int $min = 1, int $max = 10000)
    {
        $this->n = $n;
        $this->min = $min;
        $this->max = $max;
    }

    public function generate(): array
    {
        $this->numbers = [];

        for ($i = 0; $i < $this->n; $i++) {
            $this->numbers[] = random_int($this->min, $this->max);
        }

        return $this->numbers;
    }

    public function getSum(): int
    {
        return array_sum($this->numbers);
    }

    public function getAverage(): float
    {
        if (empty($this->numbers)) {
            return 0.0;
        }

        return $this->getSum() / count($this->numbers);
    }

    public function getMin(): int
    {
        if (empty($this->numbers)) {
            return 0;
        }

        return min($this->numbers);
    }

    public function getMax(): int
    {
        if (empty($this->numbers)) {
            return 0;
        }

        return max($this->numbers);
    }
}
