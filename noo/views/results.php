<?php
$stats = $stats ?? [];
$numbers = $numbers ?? [];
$average = number_format($stats['average'] ?? 0, 2, '.', '');
?>
<div class="results-card">
    <div class="results-header">
        <h2><i class="fas fa-chart-bar"></i>Resultados Generados</h2>
    </div>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th><i class="fas fa-list-ol"></i> Índice</th>
                    <th><i class="fas fa-random"></i> Número Aleatorio</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($numbers as $index => $number): ?>
                <tr>
                    <td><?php echo htmlspecialchars($index + 1, ENT_QUOTES, 'UTF-8'); ?></td>
                    <td><?php echo htmlspecialchars($number, ENT_QUOTES, 'UTF-8'); ?></td>
                </tr>
                <?php endforeach; ?>
                <tr>
                    <td><i class="fas fa-calculator"></i> Estadísticas</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <div class="stats-row">
            <div class="stat-box">
                <i class="fas fa-plus"></i>
                <div class="label">Suma</div>
                <div class="value"><?php echo htmlspecialchars($stats['sum'] ?? '0', ENT_QUOTES, 'UTF-8'); ?></div>
            </div>
            <div class="stat-box">
                <i class="fas fa-divide"></i>
                <div class="label">Promedio</div>
                <div class="value"><?php echo $average; ?></div>
            </div>
            <div class="stat-box">
                <i class="fas fa-arrow-down"></i>
                <div class="label">Mínimo</div>
                <div class="value"><?php echo htmlspecialchars($stats['min'] ?? '0', ENT_QUOTES, 'UTF-8'); ?></div>
            </div>
            <div class="stat-box">
                <i class="fas fa-arrow-up"></i>
                <div class="label">Máximo</div>
                <div class="value"><?php echo htmlspecialchars($stats['max'] ?? '0', ENT_QUOTES, 'UTF-8'); ?></div>
            </div>
        </div>
    </div>
</div>
