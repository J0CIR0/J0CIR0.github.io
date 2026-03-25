<?php
class App
{
    private $request;
    private $renderer;

    public function __construct(Request $req, Renderer $renderer)
    {
        $this->request = $req;
        $this->renderer = $renderer;
    }

    public function run(): void
    {
        if ($this->isPost()) {
            $this->handlePost();
        } else {
            $this->handleGet();
        }
    }

    private function isPost(): bool
    {
        return $_SERVER['REQUEST_METHOD'] === 'POST';
    }

    private function handlePost(): void
    {
        $validation = $this->request->validate();

        if (!empty($validation['errors'])) {
            $_SESSION['errors'] = $validation['errors'];
            $_SESSION['previous_input'] = [
                'n' => $_POST['n'] ?? '',
                'min' => $_POST['min'] ?? '',
                'max' => $_POST['max'] ?? ''
            ];
            $this->redirect();
            return;
        }

        $data = $validation['data'];
        $generator = new RandomGenerator($data['n'], $data['min'], $data['max']);
        $numbers = $generator->generate();

        $_SESSION['results'] = [
            'numbers' => $numbers,
            'stats' => [
                'sum' => $generator->getSum(),
                'average' => $generator->getAverage(),
                'min' => $generator->getMin(),
                'max' => $generator->getMax()
            ]
        ];
        $_SESSION['previous_input'] = [
            'n' => $data['n'],
            'min' => $data['min'],
            'max' => $data['max']
        ];

        $this->redirect();
    }

    private function handleGet(): void
    {
        $data = [
            'errors' => $_SESSION['errors'] ?? [],
            'results' => $_SESSION['results'] ?? null,
            'previousInput' => $_SESSION['previous_input'] ?? []
        ];

        unset($_SESSION['errors']);
        unset($_SESSION['results']);
        unset($_SESSION['previous_input']);

        echo $this->renderer->renderPage('', $data);
    }

    private function redirect(): void
    {
        $scheme = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'];
        $path = $_SERVER['REQUEST_URI'];

        header('Location: ' . $scheme . '://' . $host . $path, true, 303);
        exit;
    }
}
