<?php
$previousInput = $data['previousInput'] ?? [];
$nValue = htmlspecialchars($previousInput['n'] ?? '', ENT_QUOTES, 'UTF-8');
$minValue = htmlspecialchars($previousInput['min'] ?? '', ENT_QUOTES, 'UTF-8');
$maxValue = htmlspecialchars($previousInput['max'] ?? '', ENT_QUOTES, 'UTF-8');
?>
<form method="POST" action="./index.php">
    <div class="form-group">
        <label for="n"><i class="fas fa-hashtag"></i>Cantidad de números (N)</label>
        <input 
            type="number" 
            id="n" 
            name="n" 
            value="<?php echo $nValue; ?>"
            min="1" 
            max="1000" 
            required
            placeholder="Ej: 10"
        >
        <p class="hint"><i class="fas fa-info-circle"></i> Ingresa un número entre 1 y 1000</p>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label for="min"><i class="fas fa-arrow-down"></i>Valor mínimo (opcional)</label>
            <input 
                type="number" 
                id="min" 
                name="min" 
                value="<?php echo $minValue; ?>"
                placeholder="Ej: 1"
            >
        </div>

        <div class="form-group">
            <label for="max"><i class="fas fa-arrow-up"></i>Valor máximo (opcional)</label>
            <input 
                type="number" 
                id="max" 
                name="max" 
                value="<?php echo $maxValue; ?>"
                placeholder="Ej: 100"
            >
        </div>
    </div>

    <button type="submit" class="btn-submit"><i class="fas fa-magic"></i>Generar Números</button>
</form>
