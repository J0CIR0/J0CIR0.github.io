document.addEventListener('DOMContentLoaded', function() {
    let groupCount = 1;
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContainer = document.querySelector('.main-container');
    const contentSections = document.querySelectorAll('.content-section');
    const menuCards = document.querySelectorAll('.menu-card');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContainer.style.display = 'block';
        }, 500);
    }, 1500);
    menuCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.id.replace('-btn', '-section');
            showSection(sectionId);
        });
    });
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showMainMenu();
        });
    });
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        const section = document.getElementById(sectionId);
        section.style.display = 'block';
        section.classList.add('active');
        mainContainer.style.display = 'none';
        window.scrollTo(0, 0);
        if (sectionId === 'calculator-section') {
            initCalculator();
        }
    }
    function showMainMenu() {
        contentSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        mainContainer.style.display = 'block';
        window.scrollTo(0, 0);
    }
    function initCalculator() {
        const groupsContainer = document.getElementById('groups-container');
        const addGroupBtn = document.getElementById('add-group');
        const removeGroupBtn = document.getElementById('remove-group');
        const calculateBtn = document.getElementById('calculate');
        const exportExcelBtn = document.getElementById('export-excel');
        addGroupBtn.addEventListener('click', function() {
            if (groupCount >= 6) return alert('Máximo 6 grupos permitidos');
            groupCount++;
            const newGroup = document.createElement('div');
            newGroup.className = 'group-input';
            newGroup.innerHTML = `
                <label><i class="fas fa-layer-group"></i> Grupo ${groupCount}</label>
                <input type="text" class="group-data" placeholder="Ej: 12, 15, 18, 20">
            `;
            groupsContainer.appendChild(newGroup);
        });
        removeGroupBtn.addEventListener('click', function() {
            if (groupCount > 1) {
                groupsContainer.removeChild(groupsContainer.lastChild);
                groupCount--;
            } else {
                alert('Debe haber al menos un grupo');
            }
        });
        calculateBtn.addEventListener('click', calculateANOVA);
        exportExcelBtn.addEventListener('click', exportToExcel);
    }
    function calculateANOVA() {
        const groups = [];
        const groupInputs = document.querySelectorAll('.group-data');
        for (let i = 0; i < groupInputs.length; i++) {
            const input = groupInputs[i].value.trim();
            if (!input) return alert(`Ingrese datos para el Grupo ${i + 1}`);
            const numbers = input.split(',').map(num => {
                const parsed = parseFloat(num.trim());
                if (isNaN(parsed)) return alert(`Valor inválido en Grupo ${i + 1}: ${num}`);
                return parsed;
            }).filter(num => num !== null);
            if (numbers.length < 2) return alert(`Cada grupo debe tener al menos 2 valores (Grupo ${i + 1})`);
            groups.push(numbers);
        }
        const anovaResults = performANOVACalculations(groups);
        displayResults(anovaResults);
        document.getElementById('results-section').style.display = 'block';
    }
    function performANOVACalculations(groups) {
        const groupMeans = groups.map(group => {
            return group.reduce((sum, val) => sum + val, 0) / group.length;
        });
        const allData = groups.flat();
        const grandMean = allData.reduce((sum, val) => sum + val, 0) / allData.length;
        let SSB = 0;
        let SSW = 0;
        groups.forEach((group, i) => {
            SSB += group.length * Math.pow(groupMeans[i] - grandMean, 2);
            SSW += group.reduce((sum, val) => sum + Math.pow(val - groupMeans[i], 2), 0);
        });
        const SST = SSB + SSW;
        const k = groups.length;
        const N = allData.length;
        const dfBetween = k - 1;
        const dfWithin = N - k;
        const dfTotal = N - 1;
        const MSB = SSB / dfBetween;
        const MSW = SSW / dfWithin;
        const F = MSB / MSW;
        const pValue = fDistributionPValue(F, dfBetween, dfWithin);
        displayCalculationSteps(groups, {
            SSB, SSW, SST,
            dfBetween, dfWithin, dfTotal,
            MSB, MSW, F, pValue,
            groupMeans, grandMean
        });
        return {
            SSB, SSW, SST,
            dfBetween, dfWithin, dfTotal,
            MSB, MSW, F, pValue,
            groupMeans, grandMean,
            groupCounts: groups.map(g => g.length),
            groupData: groups
        };
    }
    function displayCalculationSteps(groups, results) {
        let meansHtml = groups.map((group, i) => 
            `<p>Grupo ${i+1}: X̄<sub>${i+1}</sub> = ${group.reduce((a,b) => a + b, 0)} / ${group.length} = ${results.groupMeans[i].toFixed(4)}</p>`
        ).join('');
        meansHtml += `<p>Media global: X̄ = ${groups.flat().reduce((a,b) => a + b, 0)} / ${groups.flat().length} = ${results.grandMean.toFixed(4)}</p>`;
        document.getElementById('step-means').innerHTML = meansHtml;
        let ssbCalc = groups.map((group, i) => 
            `${group.length} × (${results.groupMeans[i].toFixed(4)} - ${results.grandMean.toFixed(4)})² = ${(group.length * Math.pow(results.groupMeans[i] - results.grandMean, 2)).toFixed(4)}`
        ).join(' + ');
        let sswCalc = groups.map((group, i) => {
            return group.map(val => 
                `(${val} - ${results.groupMeans[i].toFixed(4)})² = ${Math.pow(val - results.groupMeans[i], 2).toFixed(4)}`
            ).join(' + ');
        }).join(' + ');
        document.getElementById('step-ss').innerHTML = `
            <p>SSB = Σn<sub>i</sub>(X̄<sub>i</sub> - X̄)² = ${ssbCalc} = ${results.SSB.toFixed(4)}</p>
            <p>SSW = ΣΣ(X<sub>ij</sub> - X̄<sub>i</sub>)² = ${sswCalc} = ${results.SSW.toFixed(4)}</p>
            <p>SST = SSB + SSW = ${results.SSB.toFixed(4)} + ${results.SSW.toFixed(4)} = ${results.SST.toFixed(4)}</p>
        `;
        document.getElementById('step-df').innerHTML = `
            <p>gl<sub>entre</sub> = k - 1 = ${groups.length} - 1 = ${results.dfBetween}</p>
            <p>gl<sub>dentro</sub> = N - k = ${groups.flat().length} - ${groups.length} = ${results.dfWithin}</p>
            <p>gl<sub>total</sub> = N - 1 = ${groups.flat().length} - 1 = ${results.dfTotal}</p>
        `;
        document.getElementById('step-ms').innerHTML = `
            <p>MSB = SSB / gl<sub>entre</sub> = ${results.SSB.toFixed(4)} / ${results.dfBetween} = ${results.MSB.toFixed(4)}</p>
            <p>MSW = SSW / gl<sub>dentro</sub> = ${results.SSW.toFixed(4)} / ${results.dfWithin} = ${results.MSW.toFixed(4)}</p>
        `;
        document.getElementById('step-f').innerHTML = `
            <p>F = MSB / MSW = ${results.MSB.toFixed(4)} / ${results.MSW.toFixed(4)} = ${results.F.toFixed(4)}</p>
            <p>Valor p = ${results.pValue.toFixed(6)}</p>
            <p class="conclusion">Conclusión: ${results.pValue < 0.05 ? 
                '<span class="reject">Rechazamos H₀ (p < 0.05) - Existen diferencias significativas</span>' : 
                '<span class="accept">No rechazamos H₀ (p ≥ 0.05) - No hay diferencias significativas</span>'}
            </p>
        `;
    }
    function displayResults(results) {
        document.getElementById('quick-f').textContent = results.F.toFixed(4);
        document.getElementById('quick-p').textContent = results.pValue.toFixed(6);
        const conclusion = results.pValue < 0.05 ? 
            "Rechazar H₀ (Existen diferencias significativas)" : 
            "No rechazar H₀ (No hay diferencias significativas)";
        document.getElementById('quick-conclusion').textContent = conclusion;
        document.getElementById('dt-ssb').textContent = results.SSB.toFixed(4);
        document.getElementById('dt-ssw').textContent = results.SSW.toFixed(4);
        document.getElementById('dt-sst').textContent = results.SST.toFixed(4);
        document.getElementById('dt-dfb').textContent = results.dfBetween;
        document.getElementById('dt-dfw').textContent = results.dfWithin;
        document.getElementById('dt-dft').textContent = results.dfTotal;
        document.getElementById('dt-msb').textContent = results.MSB.toFixed(4);
        document.getElementById('dt-msw').textContent = results.MSW.toFixed(4);
        document.getElementById('dt-f').textContent = results.F.toFixed(4);
        document.getElementById('dt-p').textContent = results.pValue.toFixed(6);
    }
    function exportToExcel() {
        const groupInputs = document.querySelectorAll('.group-data');
        const groups = Array.from(groupInputs).map(input => 
            input.value.trim().split(',').map(num => parseFloat(num.trim())));
        if (groups.some(group => group.length === 0)) {
            return alert('Hay grupos sin datos. Calcule primero el ANOVA.');
        }
        const results = performANOVACalculations(groups);
        const wb = XLSX.utils.book_new();
        const dataSheet = [['Grupo', 'Datos', 'Media', 'Desviación Estándar', 'n']];
        results.groupData.forEach((group, i) => {
            const mean = results.groupMeans[i];
            const stdDev = Math.sqrt(group.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / group.length);
            group.forEach(value => {
                dataSheet.push([
                    `Grupo ${i+1}`, 
                    value, 
                    mean.toFixed(4),
                    stdDev.toFixed(4),
                    group.length
                ]);
            });
        });
        const anovaSheet = [
            ['ANÁLISIS DE VARIANZA (ANOVA)', '', '', '', '', ''],
            ['Fuente de Variación', 'Suma de Cuadrados (SS)', 'Grados de Libertad (gl)', 'Cuadrado Medio (MS)', 'F', 'Valor p'],
            ['Entre Grupos', results.SSB.toFixed(4), results.dfBetween, results.MSB.toFixed(4), results.F.toFixed(4), results.pValue.toFixed(6)],
            ['Dentro de Grupos', results.SSW.toFixed(4), results.dfWithin, results.MSW.toFixed(4), '', ''],
            ['Total', results.SST.toFixed(4), results.dfTotal, '', '', ''],
            ['', '', '', '', '', ''],
            ['Interpretación:', results.pValue < 0.05 ? 
                'Rechazar H₀ (Existen diferencias significativas entre los grupos)' : 
                'No rechazar H₀ (No hay diferencias significativas entre los grupos)'],
            ['Nivel de significancia (α):', '0.05']
        ];
        const statsSheet = [
            ['Estadísticos Descriptivos por Grupo', '', '', '', ''],
            ['Grupo', 'Media', 'Desviación Estándar', 'n', 'Mínimo', 'Máximo']
        ];
        results.groupData.forEach((group, i) => {
            const mean = results.groupMeans[i];
            const stdDev = Math.sqrt(group.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / group.length);
            const min = Math.min(...group);
            const max = Math.max(...group);
            statsSheet.push([
                `Grupo ${i+1}`, 
                mean.toFixed(4), 
                stdDev.toFixed(4),
                group.length,
                min.toFixed(4),
                max.toFixed(4)
            ]);
        });
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dataSheet), "Datos");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(anovaSheet), "Resultados ANOVA");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(statsSheet), "Estadísticos");
        anovaSheet.push(
            ['', '', '', '', '', ''],
            ['Instrucciones para gráficos:', '', '', '', '', ''],
            ['1. Seleccione los datos en la hoja "Estadísticos"', '', '', '', '', ''],
            ['2. Inserte un gráfico de columnas para comparar medias', '', '', '', '', ''],
            ['3. Para diagramas de caja, seleccione los datos en "Datos"', '', '', '', '', ''],
            ['4. Use la función "Insertar gráfico estadístico" en Excel', '', '', '', '', '']
        );
        XLSX.writeFile(wb, "ANOVA_Resultados.xlsx");
    }
    function fDistributionPValue(F, df1, df2) {
        if (F <= 0) return 1;
        const x = df1 * F / (df1 * F + df2);
        return 1 - incompleteBeta(x, df1 / 2, df2 / 2);
    }
    function incompleteBeta(x, a, b) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        const epsilon = 1e-10;
        let result = 0;
        let term = Math.pow(x, a) * Math.pow(1 - x, b) / (a * beta(a, b));
        let j = 0;
        while (Math.abs(term) > epsilon && j < 100) {
            result += term;
            j++;
            term = term * (a + j) * (1 - x) / (a + b + j) / (j + 1);
        }
        return result;
    }
    function beta(a, b) {
        return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
    }
    function logGamma(x) {
        const cof = [
            76.18009172947146, -86.50532032941677, 24.01409824083091,
            -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
        ];
        let ser = 1.000000000190015;
        let tmp = x + 5.5;
        tmp -= (x + 0.5) * Math.log(tmp);
        
        for (let j = 0; j < 6; j++) {
            ser += cof[j] / (x + j + 1);
        }
        return -tmp + Math.log(2.5066282746310005 * ser / x);
    }
});
function calculateANOVA() {
    const calculateBtn = document.getElementById('calculate');
    const originalText = calculateBtn.innerHTML;
    calculateBtn.disabled = true;
    calculateBtn.classList.add('calculating');
    calculateBtn.innerHTML = 'Calculando <span></span>';
    setTimeout(() => {
        const groups = [];
        const groupInputs = document.querySelectorAll('.group-data');
        for (let i = 0; i < groupInputs.length; i++) {
            const input = groupInputs[i].value.trim();
            if (!input) {
                showError(`Ingrese datos para el Grupo ${i + 1}`);
                resetButton(calculateBtn, originalText);
                return;
            }
            const numbers = input.split(',').map(num => {
                const parsed = parseFloat(num.trim());
                if (isNaN(parsed)) {
                    showError(`Valor inválido en Grupo ${i + 1}: ${num}`);
                    resetButton(calculateBtn, originalText);
                    return null;
                }
                return parsed;
            }).filter(num => num !== null);
            
            if (numbers.length < 2) {
                showError(`Cada grupo debe tener al menos 2 valores (Grupo ${i + 1})`);
                resetButton(calculateBtn, originalText);
                return;
            }
            groups.push(numbers);
        }
        const anovaResults = performANOVACalculations(groups);
        displayResults(anovaResults);
        document.getElementById('results-section').style.display = 'block';
        animateResults(anovaResults.pValue);
        resetButton(calculateBtn, originalText);
    }, 1000);
}
function animateResults(pValue) {
    const resultCards = document.querySelectorAll('.result-value');
    const conclusionElement = document.getElementById('quick-conclusion');
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1.1)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 300);
        }, index * 200);
    });
    setTimeout(() => {
        if (pValue < 0.05) {
            conclusionElement.classList.add('significant');
            conclusionElement.classList.remove('not-significant');
            document.getElementById('dt-p').classList.add('significant');
        } else {
            conclusionElement.classList.add('not-significant');
            conclusionElement.classList.remove('significant');
            document.getElementById('dt-p').classList.add('not-significant');
        }
        document.querySelectorAll('.anova-table tr').forEach((row, i) => {
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, i * 100);
        });
    }, resultCards.length * 200);
}
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.calculator-input').prepend(errorDiv);
    errorDiv.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => errorDiv.remove(), 500);
    }, 3000);
}