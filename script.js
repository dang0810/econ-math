        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeIcon = document.getElementById('darkModeIcon');
        const htmlElement = document.documentElement;

        // Load saved theme preference
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'dark') {
                htmlElement.setAttribute('data-theme', 'dark');
                darkModeIcon.textContent = '☀️';
            } else {
                htmlElement.setAttribute('data-theme', 'light');
                darkModeIcon.textContent = '🌙';
            }
        }

        // Toggle dark mode
        function toggleDarkMode() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                darkModeIcon.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                darkModeIcon.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
            // Redraw charts when theme changes
            setTimeout(() => {
                updateGDPChart();
            }, 100);
        }

        // Initialize theme on load
        loadTheme();

        // Add event listener
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }

        // Navigation
        const navBtns = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sectionId = btn.getAttribute('data-section');
                switchSection(sectionId);
            });
        });

        function switchSection(sectionId) {
            sections.forEach(section => section.classList.remove('active'));
            navBtns.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(sectionId).classList.add('active');
            document.querySelector(`button[data-section="${sectionId}"]`).classList.add('active');
            window.scrollTo(0, 0);
        }

        // Lesson switching
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', function() {
                const parentSidebar = this.closest('.lesson-sidebar');
                parentSidebar.querySelectorAll('.lesson-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                const parentContainer = this.closest('.lesson-container');
                const lessonId = this.getAttribute('data-lesson');
                parentContainer.querySelectorAll('.lesson').forEach(lesson => lesson.style.display = 'none');
                document.getElementById(`lesson-${lessonId}`).style.display = 'block';
            });
        });

        // Supply & Demand Interactive
        const demandSlider = document.getElementById('demandSlider');
        const supplySlider = document.getElementById('supplySlider');
        if (demandSlider && supplySlider) {
            function updateSupplyDemand() {
                const demandVal = parseInt(demandSlider.value);
                const supplyVal = parseInt(supplySlider.value);
                document.getElementById('demandValue').textContent = demandVal;
                document.getElementById('supplyValue').textContent = supplyVal;

                // Update curves
                const demandCurve = document.getElementById('demandCurve');
                const supplyCurve = document.getElementById('supplyCurve');
                const equilibrium = document.getElementById('equilibrium');
                
                if (demandCurve && supplyCurve && equilibrium) {
                    const demandPath = `50,${350 - (demandVal / 100) * 300} 250,${200 - (demandVal - supplyVal) / 20} 450,${50 + (demandVal - supplyVal) / 20}`;
                    const supplyPath = `50,${350 - (supplyVal / 100) * 300} 250,${200 + (demandVal - supplyVal) / 20} 450,${50 - (demandVal - supplyVal) / 20}`;
                    demandCurve.setAttribute('points', demandPath);
                    supplyCurve.setAttribute('points', supplyPath);
                    
                    const eqX = 50 + (400 * (demandVal + supplyVal) / 200);
                    const eqY = 200 - ((demandVal - supplyVal) / 20);
                    equilibrium.setAttribute('cx', eqX);
                    equilibrium.setAttribute('cy', eqY);
                }
            }
            demandSlider.addEventListener('input', updateSupplyDemand);
            supplySlider.addEventListener('input', updateSupplyDemand);
        }

        // Pizza Slider
        const pizzaSlider = document.getElementById('pizzaSlider');
        if (pizzaSlider) {
            pizzaSlider.addEventListener('input', function() {
                const qty = parseInt(this.value);
                document.getElementById('pizzaValue').textContent = qty;
                
                const utilityValues = [250, 400, 480, 540, 580, 610, 630, 640, 645, 647, 648];
                const utPoint = document.getElementById('utPoint');
                if (utPoint && qty < utilityValues.length) {
                    const x = 50 + (qty * 40);
                    const y = 300 - (utilityValues[qty] / 2);
                    utPoint.setAttribute('cx', x);
                    utPoint.setAttribute('cy', y);
                }
            });
        }

        // Future Value Calculator
        const principalSlider = document.getElementById('principalSlider');
        const rateSlider = document.getElementById('rateSlider');
        const yearsSlider = document.getElementById('yearsSlider');

        function calculateFV() {
            if (principalSlider && rateSlider && yearsSlider) {
                const principal = parseFloat(principalSlider.value);
                const rate = parseFloat(rateSlider.value) / 100;
                const years = parseInt(yearsSlider.value);

                const fv = principal * Math.pow(1 + rate, years);

                document.getElementById('principalValue').textContent = '$' + principal.toLocaleString();
                document.getElementById('rateValue').textContent = (rate * 100).toFixed(1) + '%';
                document.getElementById('yearsValue').textContent = years + ' năm';
                document.getElementById('fvResult').textContent = '$' + fv.toFixed(2);
            }
        }

        if (principalSlider) {
            principalSlider.addEventListener('input', calculateFV);
            rateSlider.addEventListener('input', calculateFV);
            yearsSlider.addEventListener('input', calculateFV);
            calculateFV();
        }

        // GDP Chart Simulation
        function updateGDPChart() {
            const consumptionSlider = document.getElementById('consumptionSlider');
            const investmentSlider = document.getElementById('investmentSlider');
            
            if (consumptionSlider && investmentSlider) {
                const consumption = parseInt(consumptionSlider.value);
                const investment = parseInt(investmentSlider.value);
                const government = 15;
                const net = Math.max(0, 100 - consumption - investment - government);

                document.getElementById('consumptionValue').textContent = consumption + '%';
                document.getElementById('investmentValue').textContent = investment + '%';

                const canvas = document.getElementById('gdpChart');
                if (canvas && canvas.getContext) {
                    const ctx = canvas.getContext('2d');
                    
                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Set background based on theme
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    ctx.fillStyle = isDark ? '#252525' : '#f8f9fa';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    const width = canvas.width;
                    const height = canvas.height;
                    const colors = ['#2c5aa0', '#ff6b35', '#f39c12', '#04a777'];
                    const labels = ['Tiêu dùng (C)', 'Đầu tư (I)', 'Chính phủ (G)', 'Xuất khẩu ròng (X-M)'];
                    const values = [consumption, investment, government, net];

                    // Draw bars
                    const barHeight = 50;
                    const spacing = 20;
                    const startY = 40;
                    const maxBarWidth = width - 200; // Leave space for labels

                    values.forEach((val, idx) => {
                        const y = startY + idx * (barHeight + spacing);
                        const barWidth = (val / 100) * maxBarWidth;
                        
                        // Draw bar
                        ctx.fillStyle = colors[idx];
                        ctx.fillRect(150, y, barWidth, barHeight);
                        
                        // Draw border
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(150, y, barWidth, barHeight);
                        
                        // Draw label
                        ctx.fillStyle = isDark ? '#e0e0e0' : '#333';
                        ctx.font = 'bold 14px Arial';
                        ctx.fillText(labels[idx], 10, y + 30);
                        
                        // Draw percentage
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 16px Arial';
                        ctx.textAlign = 'center';
                        if (barWidth > 30) {
                            ctx.fillText(val.toFixed(1) + '%', 150 + barWidth / 2, y + 32);
                        } else {
                            ctx.fillStyle = isDark ? '#e0e0e0' : '#333';
                            ctx.fillText(val.toFixed(1) + '%', 150 + barWidth + 10, y + 32);
                        }
                        ctx.textAlign = 'left';
                    });
                    
                    // Draw title
                    ctx.fillStyle = isDark ? '#e0e0e0' : '#2c3e50';
                    ctx.font = 'bold 18px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Thành phần GDP (%)', width / 2, 25);
                    ctx.textAlign = 'left';
                }
            }
        }

        // Set up event listeners
        const consumptionSlider = document.getElementById('consumptionSlider');
        const investmentSlider = document.getElementById('investmentSlider');
        
        if (consumptionSlider && investmentSlider) {
            consumptionSlider.addEventListener('input', updateGDPChart);
            investmentSlider.addEventListener('input', updateGDPChart);
        }
        
        // Also update when lesson is shown
        document.querySelectorAll('.lesson-item[data-lesson="gdp"]').forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(updateGDPChart, 100);
            });
        });

        // Slope & Intercept Interactive
        const slopeSlider = document.getElementById('slopeSlider');
        const interceptSlider = document.getElementById('interceptSlider');

        function updateLine() {
            if (slopeSlider && interceptSlider) {
                const slope = parseFloat(slopeSlider.value);
                const intercept = parseInt(interceptSlider.value);

                document.getElementById('slopeValue').textContent = slope.toFixed(1);
                document.getElementById('interceptValue').textContent = intercept;

                const functionLine = document.getElementById('functionLine');
                if (functionLine) {
                    // y = mx + b, calculate points
                    // At x = -200: y = -200m + b
                    // At x = 200: y = 200m + b
                    const y1 = 200 - (-200 * slope + intercept) / 10;
                    const y2 = 200 - (200 * slope + intercept) / 10;
                    
                    functionLine.setAttribute('points', `50,${y1} 450,${y2}`);
                }
            }
        }

        if (slopeSlider) {
            slopeSlider.addEventListener('input', updateLine);
            interceptSlider.addEventListener('input', updateLine);
            updateLine();
        }

        // Additional event listeners for new interactive lessons
        
        // Consumer Choice (CC) Interactive
        ['cc-I', 'cc-Px', 'cc-Py'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    const I = parseFloat(document.getElementById('cc-I').value);
                    const Px = parseFloat(document.getElementById('cc-Px').value);
                    const Py = parseFloat(document.getElementById('cc-Py').value);
                    
                    document.getElementById('cc-I-val').textContent = I.toFixed(0);
                    document.getElementById('cc-Px-val').textContent = Px.toFixed(1);
                    document.getElementById('cc-Py-val').textContent = Py.toFixed(1);
                    
                    // Optimal choice (Cobb-Douglas α=0.5)
                    const alpha = 0.5;
                    const xStar = (alpha * I) / Px;
                    const yStar = ((1 - alpha) * I) / Py;
                    
                    // Update SVG
                    const budgetLine = document.getElementById('cc-budget');
                    const xInt = I / Px, yInt = I / Py;
                    if (budgetLine) {
                        budgetLine.setAttribute('x1', 40 + (xInt / (I/Px + 5)) * 310);
                        budgetLine.setAttribute('y1', 300 - (yInt / (I/Py + 5)) * 250);
                        budgetLine.setAttribute('x2', 40 + (xInt / (I/Px + 5)) * 310);
                        budgetLine.setAttribute('y2', 300);
                    }
                    
                    const optPoint = document.getElementById('cc-opt');
                    if (optPoint) {
                        optPoint.setAttribute('cx', 80 + (xStar / 20) * 300);
                        optPoint.setAttribute('cy', 300 - (yStar / 30) * 250);
                    }
                });
            }
        });

        // AD–AS Model Shift
        ['ad-shift', 'as-shift'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    const adShift = parseFloat(document.getElementById('ad-shift').value);
                    const asShift = parseFloat(document.getElementById('as-shift').value);
                    
                    document.getElementById('ad-shift-val').textContent = adShift;
                    document.getElementById('as-shift-val').textContent = asShift;
                    
                    // Update curve positions (simplified)
                    const adCurve = document.getElementById('ad-curve');
                    const asCurve = document.getElementById('as-curve');
                    if (adCurve) {
                        // Shift AD right by adShift
                        let pts = adCurve.getAttribute('points').split(' ');
                        pts = pts.map((pt, i) => {
                            if (i % 2 === 0) {
                                const x = parseFloat(pt) + (adShift * 3);
                                return x;
                            }
                            return pt;
                        }).join(' ');
                    }
                });
            }
        });

        // Surplus Interactive
        ['su-a'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    const a = parseFloat(document.getElementById('su-a').value);
                    document.getElementById('su-a-val').textContent = a.toFixed(0);
                    // Update demand curve visualization
                });
            }
        });

        // OLS Line Interactive
        ['ols-slope', 'ols-intercept'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    const slope = parseFloat(document.getElementById('ols-slope').value);
                    const intercept = parseFloat(document.getElementById('ols-intercept').value);
                    
                    document.getElementById('ols-slope-val').textContent = slope.toFixed(2);
                    document.getElementById('ols-intercept-val').textContent = intercept.toFixed(0);
                    
                    const line = document.getElementById('ols-line');
                    if (line) {
                        const y1 = 250 - (intercept / 30) * 230;
                        const y2 = 250 - ((intercept + slope * 380) / 30) * 230;
                        line.setAttribute('y1', Math.max(20, Math.min(250, y1)));
                        line.setAttribute('y2', Math.max(20, Math.min(250, y2)));
                    }
                });
            }
        });

        // Portfolio Weight Interactive
        const pfW1 = document.getElementById('pf-w1');
        if (pfW1) {
            pfW1.addEventListener('input', function() {
                const w1 = parseFloat(this.value) / 100;
                document.getElementById('pf-w1-val').textContent = parseInt(this.value);
                
                // Mock portfolio movement
                const x = 120 + (w1 * 220);
                const y = 180 - (w1 * 80);
                const pf = document.getElementById('pf-current');
                if (pf) {
                    pf.setAttribute('cx', x);
                    pf.setAttribute('cy', y);
                }
            });
        }

        // Options Payoff Interactive
        ['opt-K', 'opt-C'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    const K = parseFloat(document.getElementById('opt-K').value);
                    const C = parseFloat(document.getElementById('opt-C').value);
                    
                    document.getElementById('opt-K-val').textContent = K.toFixed(0);
                    document.getElementById('opt-C-val').textContent = C.toFixed(1);
                    
                    const payoff = document.getElementById('opt-payoff');
                    const strike = document.getElementById('opt-strike');
                    if (payoff && strike) {
                        const strikeX = 40 + ((K - 30) / 40) * 380;
                        strike.setAttribute('x1', strikeX);
                        strike.setAttribute('x2', strikeX);
                        
                        // Payoff line
                        payoff.setAttribute('points', `40,${150 + C*10} ${strikeX},${150 + C*10} 420,${50 - (420-strikeX)*0.3}`);
                    }
                });
            }
        });

        // Initialize
        window.addEventListener('load', () => {
            calculateFV();
            updateGDPChart();
            updateSupplyDemand?.();
        });
        
        // Update GDP chart when lesson is displayed
        const lessonSwitcher = document.querySelectorAll('.lesson-item');
        lessonSwitcher.forEach(item => {
            item.addEventListener('click', function() {
                const lessonId = this.getAttribute('data-lesson');
                if (lessonId === 'gdp') {
                    setTimeout(updateGDPChart, 100);
                }
            });
        });
