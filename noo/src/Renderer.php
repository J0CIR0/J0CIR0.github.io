<?php
class Renderer
{
    public function renderForm(array $data = []): string
    {
        ob_start();
        include __DIR__ . '/../views/form.php';
        return ob_get_clean();
    }

    public function renderResults(array $numbers, array $stats, array $previousInput = []): string
    {
        ob_start();
        include __DIR__ . '/../views/results.php';
        return ob_get_clean();
    }

    public function renderPage(string $content, array $data = []): string
    {
        $formHtml = $this->renderForm($data);
        $resultsHtml = '';

        if (!empty($data['results'])) {
            $resultsHtml = $this->renderResults(
                $data['results']['numbers'],
                $data['results']['stats'],
                $data['previousInput'] ?? []
            );
        }

        return $this->getHtmlDocument($formHtml, $resultsHtml, $data);
    }

    private function getHtmlDocument(string $formHtml, string $resultsHtml, array $data): string
    {
        $errors = $data['errors'] ?? [];
        $errorHtml = '';

        if (!empty($errors)) {
            $errorHtml = '<div class="error-container"><i class="fas fa-exclamation-circle"></i><div class="error-content">';
            foreach ($errors as $error) {
                $safeError = htmlspecialchars($error, ENT_QUOTES, 'UTF-8');
                $errorHtml .= '<p class="error">' . $safeError . '</p>';
            }
            $errorHtml .= '</div></div>';
        }

        return '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Números Aleatorios</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 50%, #0d1b2a 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .card {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(100, 200, 255, 0.1);
            overflow: hidden;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }

        .card-header {
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .card-header::before {
            content: "";
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }

        .card-header h1 {
            color: white;
            font-size: 2.2rem;
            font-weight: 700;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
            margin-bottom: 10px;
        }

        .card-header h1 i {
            margin-right: 15px;
            font-size: 2.5rem;
        }

        .card-header p {
            color: rgba(255, 255, 255, 0.95);
            font-size: 1.05rem;
            position: relative;
            z-index: 1;
        }

        .card-body {
            padding: 40px;
        }

        .form-group {
            margin-bottom: 28px;
            position: relative;
        }

        .form-group label {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-weight: 600;
            color: #0ff;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-group label i {
            margin-right: 8px;
            font-size: 1.1rem;
            color: #00d4ff;
        }

        .form-group input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #00d4ff;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: rgba(0, 212, 255, 0.05);
            color: #fff;
        }

        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .form-group input:focus {
            outline: none;
            border-color: #00ffff;
            background: rgba(0, 212, 255, 0.15);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
        }

        .form-group .hint {
            font-size: 0.8rem;
            color: rgba(0, 212, 255, 0.7);
            margin-top: 6px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 10px;
            box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
        }

        .btn-submit:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0, 212, 255, 0.5);
        }

        .btn-submit:active {
            transform: translateY(0);
        }

        .btn-submit i {
            margin-right: 8px;
        }

        .error-container {
            background: linear-gradient(135deg, rgba(255, 69, 0, 0.2) 0%, rgba(220, 20, 60, 0.2) 100%);
            border-left: 4px solid #ff4500;
            border: 1px solid rgba(255, 69, 0, 0.3);
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 25px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .error-container i {
            color: #ff4500;
            font-size: 1.3rem;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .error-content {
            flex: 1;
        }

        .error {
            color: #ff6b5b;
            margin: 0;
            font-weight: 500;
            line-height: 1.6;
        }

        .error:not(:last-child) {
            margin-bottom: 8px;
        }

        .results-card {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 255, 100, 0.1);
            overflow: hidden;
            backdrop-filter: blur(10px);
        }

        .results-header {
            background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
            padding: 30px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .results-header::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }

        .results-header h2 {
            color: white;
            font-size: 1.8rem;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }

        .results-header h2 i {
            margin-right: 12px;
            font-size: 2rem;
        }

        .table-container {
            padding: 30px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
        }

        thead {
            background: rgba(0, 255, 136, 0.1);
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 700;
            color: #00ff88;
            border-bottom: 2px solid #00ff88;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }

        th:last-child {
            text-align: right;
        }

        td {
            padding: 14px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.85);
        }

        td:last-child {
            text-align: right;
            font-family: "Courier New", monospace;
            font-weight: 600;
            color: #00ff88;
        }

        tbody tr {
            transition: background 0.2s ease;
        }

        tbody tr:hover {
            background: rgba(0, 255, 136, 0.1);
        }

        tbody tr:last-child td {
            border-bottom: none;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 204, 102, 0.2) 100%);
            color: #00ff88;
            font-weight: 700;
            border-top: 2px solid #00ff88;
        }

        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 25px;
        }

        .stat-box {
            background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
            color: white;
            padding: 25px 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
            transition: all 0.3s ease;
        }

        .stat-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 255, 136, 0.5);
        }

        .stat-box i {
            font-size: 1.8rem;
            margin-bottom: 10px;
            display: block;
        }

        .stat-box .label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.95;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .stat-box .value {
            font-size: 1.6rem;
            font-weight: 700;
            font-family: "Courier New", monospace;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            color: rgba(0, 212, 255, 0.6);
            font-size: 0.9rem;
        }

        .footer i {
            margin: 0 5px;
            color: #00ff88;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes glow {
            0%, 100% {
                box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
            }
            50% {
                box-shadow: 0 8px 30px rgba(0, 212, 255, 0.5);
            }
        }

        .card {
            animation: fadeIn 0.6s ease forwards;
        }

        .results-card {
            animation: fadeIn 0.6s ease 0.2s forwards;
            opacity: 0;
        }

        @media (max-width: 600px) {
            .form-row {
                grid-template-columns: 1fr;
            }

            .stats-row {
                grid-template-columns: repeat(2, 1fr);
            }

            .card-header h1 {
                font-size: 1.7rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h1><i class="fas fa-dice"></i>Generador de Números Aleatorios</h1>
                <p><i class="fas fa-sparkles"></i> Ingresa la cantidad de números aleatorios que deseas generar</p>
            </div>
            <div class="card-body">
                ' . $errorHtml . '
                ' . $formHtml . '
            </div>
        </div>
        ' . $resultsHtml . '
        <div class="footer">
            <p><i class="fas fa-star"></i> Generador de Números Aleatorios &copy; 2024 <i class="fas fa-star"></i></p>
        </div>
    </div>
</body>
</html>';
    }
}
