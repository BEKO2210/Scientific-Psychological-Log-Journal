// Scientific Psychological Log Journal - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Security: Input sanitization function
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Language text mappings
    const translations = {
        en: {
            journalPlaceholder: "Describe your thoughts, feelings, and reactions...",
            triggerPlaceholder: "What happened?",
            thoughtsPlaceholder: "What thoughts went through your mind?",
            saveJournal: "Log Entry",
            generateReport: "Generate Report",
            saveReport: "Save Report",
            loadReport: "Load Report",
            errorLoadingReport: "Error loading report: Invalid file format",
            noEntriesToReport: "No journal entries found to generate a report.",
            reportGenerated: "Report generated successfully!"
        },
        de: {
            journalPlaceholder: "Beschreibe deine Gedanken, Gefühle und Reaktionen...",
            triggerPlaceholder: "Was ist passiert?",
            thoughtsPlaceholder: "Welche Gedanken gingen dir durch den Kopf?",
            saveJournal: "Eintrag protokollieren",
            generateReport: "Bericht erstellen",
            saveReport: "Bericht speichern",
            loadReport: "Bericht laden",
            errorLoadingReport: "Fehler beim Laden des Berichts: Ungültiges Dateiformat",
            noEntriesToReport: "Keine Tagebucheinträge gefunden, um einen Bericht zu erstellen.",
            reportGenerated: "Bericht erfolgreich erstellt!"
        }
    };

    // Language switching functionality
    const langEnBtn = document.getElementById('lang-en');
    const langDeBtn = document.getElementById('lang-de');

    // Modal functionality
    const modal = document.getElementById('exercise-modal');
    const closeBtn = document.querySelector('.close');
    const exerciseContainer = document.getElementById('exercise-container');

    // Journal functionality
    const journalEntry = document.getElementById('journal-entry');
    const saveJournalBtn = document.getElementById('save-journal');
    const journalEntries = document.getElementById('journal-entries');
    const moodRating = document.getElementById('mood-rating');
    const moodValue = document.getElementById('mood-value');
    const emotionSelect = document.getElementById('emotion-select');
    const triggerInput = document.getElementById('trigger-input');
    const thoughtsInput = document.getElementById('thoughts-input');
    const copingStrategy = document.getElementById('coping-strategy');
    const anxietyRating = document.getElementById('anxiety-rating');
    const anxietyValue = document.getElementById('anxiety-value');
    const depressionRating = document.getElementById('depression-rating');
    const depressionValue = document.getElementById('depression-value');
    const stressRating = document.getElementById('stress-rating');
    const stressValue = document.getElementById('stress-value');

    // Report functionality
    const generateReportBtn = document.getElementById('generate-report');
    const saveReportBtn = document.getElementById('save-report');
    const loadReportBtn = document.getElementById('load-report-btn');
    const loadReportInput = document.getElementById('load-report');
    const reportContent = document.getElementById('report-content');

    // Start exercise buttons
    const startButtons = document.querySelectorAll('.start-btn');

    // Initialize language to English
    let currentLang = 'en';

    // Update mood value display
    moodRating.addEventListener('input', function() {
        moodValue.textContent = this.value;
    });

    // Update anxiety value display
    anxietyRating.addEventListener('input', function() {
        anxietyValue.textContent = this.value;
    });

    // Update depression value display
    depressionRating.addEventListener('input', function() {
        depressionValue.textContent = this.value;
    });

    // Update stress value display
    stressRating.addEventListener('input', function() {
        stressValue.textContent = this.value;
    });

    // Language switching
    langEnBtn.addEventListener('click', function() {
        switchLanguage('en');
    });

    langDeBtn.addEventListener('click', function() {
        switchLanguage('de');
    });

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Open exercise modal when start button is clicked
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exerciseType = this.getAttribute('data-experiment');
            loadExercise(exerciseType);
            modal.style.display = 'block';
        });
    });

    // Save journal entry
    saveJournalBtn.addEventListener('click', function() {
        const entryText = journalEntry.value.trim();
        if (entryText) {
            saveJournalEntry(entryText);
            journalEntry.value = '';
            triggerInput.value = '';
            thoughtsInput.value = '';
        }
    });

    // Generate report
    generateReportBtn.addEventListener('click', function() {
        generateScientificReport();
    });

    // Save report
    saveReportBtn.addEventListener('click', function() {
        saveScientificReport();
    });

    // Load report button
    loadReportBtn.addEventListener('click', function() {
        loadReportInput.click();
    });

    // Load report from file
    loadReportInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const reportData = JSON.parse(e.target.result);
                    loadScientificReport(reportData);
                } catch (error) {
                    alert(currentLang === 'en'
                        ? 'Error loading report: Invalid file format'
                        : 'Fehler beim Laden des Berichts: Ungültiges Dateiformat');
                }
            };
            reader.readAsText(file);
        }
        // Reset the input so the same file can be loaded again
        event.target.value = '';
    });

    // Switch language function
    function switchLanguage(lang) {
        currentLang = lang;

        // Update button states
        if (lang === 'en') {
            langEnBtn.classList.add('active');
            langDeBtn.classList.remove('active');
        } else {
            langDeBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        }

        // Update all elements with data-lang attribute
        const langElements = document.querySelectorAll('[data-lang]');
        langElements.forEach(element => {
            if (element.getAttribute('data-lang') === lang) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });

        // Update dynamic text content and placeholders
        const t = translations[lang];

        journalEntry.placeholder = t.journalPlaceholder;
        triggerInput.placeholder = t.triggerPlaceholder;
        thoughtsInput.placeholder = t.thoughtsPlaceholder;

        // Update button texts
        const saveJournalBtn = document.getElementById('save-journal');
        const generateReportBtn = document.getElementById('generate-report');
        const saveReportBtn = document.getElementById('save-report');
        const loadReportBtn = document.getElementById('load-report-btn');

        if (saveJournalBtn) saveJournalBtn.textContent = t.saveJournal;
        if (generateReportBtn) generateReportBtn.textContent = t.generateReport;
        if (saveReportBtn) saveReportBtn.textContent = t.saveReport;
        if (loadReportBtn) loadReportBtn.textContent = t.loadReport;
    }

    // Load exercise content based on type
    function loadExercise(type) {
        let content = '';

        switch(type) {
            case 'cognitive':
                content = createCognitiveRestructuringExercise();
                break;
            case 'emotions':
                content = createEmotionalRegulationExercise();
                break;
            case 'behaviors':
                content = createBehavioralActivationExercise();
                break;
            case 'beliefs':
                content = createCoreBeliefExplorationExercise();
                break;
            case 'values':
                content = createValuesClarificationExercise();
                break;
            case 'relationships':
                content = createInterpersonalEffectivenessExercise();
                break;
            case 'stress':
                content = createStressCopingAssessmentExercise();
                break;
            case 'mindfulness':
                content = createMindfulnessExercise();
                break;
            default:
                content = '<p data-lang="en">Exercise not found.</p><p data-lang="de" class="hidden">Übung nicht gefunden.</p>';
        }

        exerciseContainer.innerHTML = content;

        // Update language in the modal content
        updateModalLanguage();

        // Add event listeners for exercise buttons
        const finishBtn = document.getElementById('finish-exercise');

        if (finishBtn) {
            finishBtn.addEventListener('click', finishExercise);
        }
    }

    // Update language in modal content
    function updateModalLanguage() {
        const langElements = exerciseContainer.querySelectorAll('[data-lang]');
        langElements.forEach(element => {
            if (element.getAttribute('data-lang') === currentLang) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    // Cognitive Restructuring Exercise (CBT-based)
    function createCognitiveRestructuringExercise() {
        const titleEn = 'Cognitive Restructuring Exercise (CBT)';
        const titleDe = 'Kognitive Umstrukturierung Übung (KVT)';
        const instructionEn = 'This evidence-based CBT exercise helps you identify and reframe cognitive distortions. Use the thought record technique to examine your thoughts objectively.';
        const instructionDe = 'Diese evidenzbasierte KVT-Übung hilft dir, kognitive Verzerrungen zu identifizieren und umzustrukturieren. Verwende die Gedankenaufzeichnungstechnik, um deine Gedanken objektiv zu betrachten.';

        const q1TitleEn = 'Situation';
        const q1TitleDe = 'Situation';
        const q1En = 'Describe the situation that triggered your emotional response. Be specific and objective.';
        const q1De = 'Beschreibe die Situation, die deine emotionale Reaktion ausgelöst hat. Sei spezifisch und objektiv.';

        const q2TitleEn = 'Emotions';
        const q2TitleDe = 'Emotionen';
        const q2En = 'What emotions did you experience? Rate their intensity (0-100%).';
        const q2De = 'Welche Emotionen hast du erlebt? Bewert ihre Intensität (0-100%).';

        const q3TitleEn = 'Automatic Thoughts';
        const q3TitleDe = 'Automatische Gedanken';
        const q3En = 'What thoughts went through your mind during this situation? (What was going through your mind? What does this situation mean about you?)';
        const q3De = 'Welche Gedanken gingen dir während dieser Situation durch den Kopf? (Was ging dir durch den Kopf? Was bedeutet diese Situation über dich?)';

        const q4TitleEn = 'Cognitive Distortions';
        const q4TitleDe = 'Kognitive Verzerrungen';
        const q4En = 'Identify any cognitive distortions in your thoughts (e.g., all-or-nothing thinking, catastrophizing, mind reading, etc.).';
        const q4De = 'Identifiziere kognitive Verzerrungen in deinen Gedanken (z.B. Schwarz-Weiß-Denken, Katastrophisieren, Gedankenlesen, etc.).';

        const q5TitleEn = 'Evidence For';
        const q5TitleDe = 'Beweise dafür';
        const q5En = 'What evidence supports your thoughts? Be objective and specific.';
        const q5De = 'Welche Beweise unterstützen deine Gedanken? Sei objektiv und spezifisch.';

        const q6TitleEn = 'Evidence Against';
        const q6TitleDe = 'Beweise dagegen';
        const q6En = 'What evidence contradicts your thoughts? Consider alternative explanations.';
        const q6De = 'Welche Beweise widersprechen deinen Gedanken? Erwäge alternative Erklärungen.';

        const q7TitleEn = 'Balanced Thought';
        const q7TitleDe = 'Ausgewogener Gedanke';
        const q7En = 'What would be a more balanced, realistic thought about this situation?';
        const q7De = 'Was wäre ein ausgewogenerer, realistischerer Gedanke zu dieser Situation?';

        const q8TitleEn = 'Outcome';
        const q8TitleDe = 'Ergebnis';
        const q8En = 'How would you feel if you believed this balanced thought? Rate the intensity (0-100%).';
        const q8De = 'Wie würdest du dich fühlen, wenn du diesen ausgewogenen Gedanken glauben würdest? Bewert die Intensität (0-100%).';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="cognitive-q1" placeholder="Describe the situation..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q1" placeholder="Beschreibe die Situation..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="cognitive-q2" placeholder="List emotions and their intensity..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q2" placeholder="Liste Emotionen und deren Intensität auf..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="cognitive-q3" placeholder="Record your automatic thoughts..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q3" placeholder="Notiere deine automatischen Gedanken..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="cognitive-q4" placeholder="Identify cognitive distortions..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q4" placeholder="Identifiziere kognitive Verzerrungen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="cognitive-q5" placeholder="List supporting evidence..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q5" placeholder="Liste unterstützende Beweise auf..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="cognitive-q6" placeholder="List contradicting evidence..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q6" placeholder="Liste widerlegende Beweise auf..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q7TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q7TitleDe}</h3>
                    <p data-lang="en">${q7En}</p>
                    <p data-lang="de" class="hidden">${q7De}</p>
                    <textarea class="exercise-response" id="cognitive-q7" placeholder="Formulate a balanced thought..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q7" placeholder="Formuliere einen ausgewogenen Gedanken..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q8TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q8TitleDe}</h3>
                    <p data-lang="en">${q8En}</p>
                    <p data-lang="de" class="hidden">${q8De}</p>
                    <textarea class="exercise-response" id="cognitive-q8" placeholder="Rate the intensity of your balanced thought..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="cognitive-q8" placeholder="Bewerte die Intensität deines ausgewogenen Gedankens..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Emotional Regulation Exercise (DBT-based)
    function createEmotionalRegulationExercise() {
        const titleEn = 'Emotional Regulation Exercise (DBT)';
        const titleDe = 'Emotionsregulation Übung (DBT)';
        const instructionEn = 'This evidence-based DBT exercise helps you understand and manage your emotional responses using the PLEASE skill.';
        const instructionDe = 'Diese evidenzbasierte DBT-Übung hilft dir, deine emotionalen Reaktionen zu verstehen und zu managen mit der PLEASE-Fähigkeit.';

        const q1TitleEn = 'Physical State';
        const q1TitleDe = 'Körperlicher Zustand';
        const q1En = 'How is your physical state affecting your emotions? (Consider sleep, exercise, nutrition, illness)';
        const q1De = 'Wie beeinflusst dein körperlicher Zustand deine Emotionen? (Betrachte Schlaf, Bewegung, Ernährung, Krankheit)';

        const q2TitleEn = 'Emotional Vulnerability';
        const q2TitleDe = 'Emotionale Verletzlichkeit';
        const q2En = 'What factors are increasing your emotional vulnerability? (Stress, conflict, fatigue)';
        const q2De = 'Welche Faktoren erhöhen deine emotionale Verletzlichkeit? (Stress, Konflikt, Erschöpfung)';

        const q3TitleEn = 'Mindfulness of Emotions';
        const q3TitleDe = 'Achtsamkeit gegenüber Emotionen';
        const q3En = 'Observe your emotions without judgment. What are you feeling right now?';
        const q3De = 'Beobachte deine Emotionen ohne Bewertung. Was fühlst du gerade?';

        const q4TitleEn = 'Opposite Action';
        const q4TitleDe = 'Gegenteilige Handlung';
        const q4En = 'What would be the opposite action to your emotional urge? How might this help?';
        const q4De = 'Was wäre die gegenteilige Handlung zu deinem emotionalen Drang? Wie könnte dies helfen?';

        const q5TitleEn = 'Accumulate Positive Emotions';
        const q5TitleDe = 'Positive Emotionen ansammeln';
        const q5En = 'What activities could you engage in to build positive emotions?';
        const q5De = 'Welche Aktivitäten könntest du unternehmen, um positive Emotionen aufzubauen?';

        const q6TitleEn = 'Build Mastery';
        const q6TitleDe = 'Meisterleistungen aufbauen';
        const q6En = 'What small accomplishment could you achieve today to build confidence?';
        const q6De = 'Welche kleine Leistung könntest du heute erzielen, um Vertrauen aufzubauen?';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="emotions-q1" placeholder="Describe how your physical state affects your emotions..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="emotions-q1" placeholder="Beschreibe, wie dein körperlicher Zustand deine Emotionen beeinflusst..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="emotions-q2" placeholder="Identify factors increasing emotional vulnerability..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="emotions-q2" placeholder="Identifiziere Faktoren, die die emotionale Verletzlichkeit erhöhen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="emotions-q3" placeholder="Observe your current emotions without judgment..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="emotions-q3" placeholder="Beobachte deine aktuellen Emotionen ohne Bewertung..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="emotions-q4" placeholder="Describe the opposite action to your emotional urge..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="emotions-q4" placeholder="Beschreibe die gegenteilige Handlung zu deinem emotionalen Drang..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="emotions-q5" placeholder="List activities to build positive emotions..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="emotions-q5" placeholder="Liste Aktivitäten auf, um positive Emotionen aufzubauen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="emotions-q6" placeholder="Describe a small accomplishment you could achieve today..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="emotions-q6" placeholder="Beschreibe eine kleine Leistung, die du heute erzielen könntest..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Behavioral Activation Exercise
    function createBehavioralActivationExercise() {
        const titleEn = 'Behavioral Activation Exercise';
        const titleDe = 'Verhaltensaktivierung Übung';
        const instructionEn = 'This evidence-based exercise helps increase engagement in meaningful activities to improve mood and motivation.';
        const instructionDe = 'Diese evidenzbasierte Übung hilft, die Beteiligung an sinnvollen Aktivitäten zu erhöhen, um Stimmung und Motivation zu verbessern.';

        const q1TitleEn = 'Pleasurable Activities';
        const q1TitleDe = 'Angenehme Aktivitäten';
        const q1En = 'List activities you used to enjoy or think you might enjoy. Rate them (0-10) for pleasure and mastery.';
        const q1De = 'Liste Aktivitäten auf, die du früher genossen hast oder von denen du denkst, dass du sie genießen könntest. Bewert sie (0-10) für Vergnügen und Meisterleistung.';

        const q2TitleEn = 'Activity Scheduling';
        const q2TitleDe = 'Aktivitätsplanung';
        const q2En = 'Schedule a pleasant activity for the next few days. Be specific about when, where, and how.';
        const q2De = 'Plane eine angenehme Aktivität für die nächsten Tage. Sei spezifisch über wann, wo und wie.';

        const q3TitleEn = 'Values-Based Activities';
        const q3TitleDe = 'Wertebasierte Aktivitäten';
        const q3En = 'Identify activities that align with your core values. How do they connect to what matters most to you?';
        const q3De = 'Identifiziere Aktivitäten, die mit deinen Kernwerten übereinstimmen. Wie verbinden sie sich mit dem, was dir am meisten wichtig ist?';

        const q4TitleEn = 'Activity Monitoring';
        const q4TitleDe = 'Aktivitätsüberwachung';
        const q4En = 'Track your daily activities and rate your mood before and after each activity.';
        const q4De = 'Verfolge deine täglichen Aktivitäten und bewerte deine Stimmung vor und nach jeder Aktivität.';

        const q5TitleEn = 'Barriers Identification';
        const q5TitleDe = 'Barrieren Identifikation';
        const q5En = 'What barriers prevent you from engaging in pleasant or meaningful activities?';
        const q5De = 'Welche Barrieren verhindern, dass du an angenehmen oder sinnvollen Aktivitäten teilnimmst?';

        const q6TitleEn = 'Problem-Solving';
        const q6TitleDe = 'Problemlösung';
        const q6En = 'How can you overcome the barriers you identified? Create specific action plans.';
        const q6De = 'Wie kannst du die von dir identifizierten Barrieren überwinden? Erstelle spezifische Aktionspläne.';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="behaviors-q1" placeholder="List activities and rate them for pleasure and mastery..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="behaviors-q1" placeholder="Liste Aktivitäten auf und bewerte sie für Vergnügen und Meisterleistung..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="behaviors-q2" placeholder="Schedule a pleasant activity with specifics..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="behaviors-q2" placeholder="Plane eine angenehme Aktivität mit Details..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="behaviors-q3" placeholder="Identify values-based activities and their connection to your values..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="behaviors-q3" placeholder="Identifiziere wertebasierte Aktivitäten und deren Verbindung zu deinen Werten..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="behaviors-q4" placeholder="Describe how to track activities and mood..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="behaviors-q4" placeholder="Beschreibe, wie Aktivitäten und Stimmung verfolgt werden können..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="behaviors-q5" placeholder="Identify barriers to engaging in activities..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="behaviors-q5" placeholder="Identifiziere Barrieren für die Teilnahme an Aktivitäten..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="behaviors-q6" placeholder="Create action plans to overcome identified barriers..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="behaviors-q6" placeholder="Erstelle Aktionspläne, um identifizierte Barrieren zu überwinden..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Core Belief Exploration Exercise (Schema Therapy-based)
    function createCoreBeliefExplorationExercise() {
        const titleEn = 'Core Belief Exploration (Schema Therapy)';
        const titleDe = 'Kernüberzeugungen Erforschung (Schematherapie)';
        const instructionEn = 'This evidence-based schema therapy exercise helps you identify and examine your fundamental beliefs about yourself, others, and the world.';
        const instructionDe = 'Diese evidenzbasierte Schematherapie-Übung hilft dir, deine grundlegenden Überzeugungen über dich selbst, andere und die Welt zu identifizieren und zu untersuchen.';

        const q1TitleEn = 'Early Memories';
        const q1TitleDe = 'Frühe Erinnerungen';
        const q1En = 'Recall early memories that shaped your core beliefs. What messages did you receive about yourself?';
        const q1De = 'Erinnere dich an frühe Erinnerungen, die deine Kernüberzeugungen geprägt haben. Welche Botschaften hast du über dich selbst erhalten?';

        const q2TitleEn = 'Core Beliefs About Self';
        const q2TitleDe = 'Kernüberzeugungen über sich selbst';
        const q2En = 'What are your core beliefs about yourself? (e.g., "I am unlovable", "I am competent", "I am worthy")';
        const q2De = 'Was sind deine Kernüberzeugungen über dich selbst? (z.B. "Ich bin unliebenswert", "Ich bin kompetent", "Ich bin wertvoll")';

        const q3TitleEn = 'Core Beliefs About Others';
        const q3TitleDe = 'Kernüberzeugungen über andere';
        const q3En = 'What are your core beliefs about others? (e.g., "Others are rejecting", "Others are supportive", "Others are unreliable")';
        const q3De = 'Was sind deine Kernüberzeugungen über andere? (z.B. "Andere sind ablehnend", "Andere sind unterstützend", "Andere sind unzuverlässig")';

        const q4TitleEn = 'Core Beliefs About the World';
        const q4TitleDe = 'Kernüberzeugungen über die Welt';
        const q4En = 'What are your core beliefs about the world? (e.g., "The world is dangerous", "The world is safe", "The world is unpredictable")';
        const q4De = 'Was sind deine Kernüberzeugungen über die Welt? (z.B. "Die Welt ist gefährlich", "Die Welt ist sicher", "Die Welt ist unvorhersehbar")';

        const q5TitleEn = 'Schema Identification';
        const q5TitleDe = 'Schema Identifikation';
        const q5En = 'Which of the 18 early maladaptive schemas do you recognize in yourself? (e.g., abandonment, mistrust, emotional deprivation)';
        const q5De = 'Welche der 18 frühen nachteiligen Schemata erkennst du bei dir? (z.B. Verlassenwerden, Misstrauen, emotionale Entbehrung)';

        const q6TitleEn = 'Schema Triggers';
        const q6TitleDe = 'Schema Auslöser';
        const q6En = 'What situations or interactions trigger your core beliefs and schemas?';
        const q6De = 'Welche Situationen oder Interaktionen lösen deine Kernüberzeugungen und Schemata aus?';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="beliefs-q1" placeholder="Recall early memories that shaped your core beliefs..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="beliefs-q1" placeholder="Erinnere dich an frühe Erinnerungen, die deine Kernüberzeugungen geprägt haben..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="beliefs-q2" placeholder="List your core beliefs about yourself..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="beliefs-q2" placeholder="Liste deine Kernüberzeugungen über dich selbst auf..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="beliefs-q3" placeholder="List your core beliefs about others..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="beliefs-q3" placeholder="Liste deine Kernüberzeugungen über andere auf..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="beliefs-q4" placeholder="List your core beliefs about the world..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="beliefs-q4" placeholder="Liste deine Kernüberzeugungen über die Welt auf..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="beliefs-q5" placeholder="Identify which early maladaptive schemas you recognize..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="beliefs-q5" placeholder="Identifiziere, welche frühen nachteiligen Schemata du erkennst..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="beliefs-q6" placeholder="Describe situations that trigger your core beliefs..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="beliefs-q6" placeholder="Beschreibe Situationen, die deine Kernüberzeugungen auslösen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Values Clarification Exercise (ACT-based)
    function createValuesClarificationExercise() {
        const titleEn = 'Values Clarification (ACT)';
        const titleDe = 'Werteklärung (AKT)';
        const instructionEn = 'This evidence-based Acceptance and Commitment Therapy exercise helps you identify and commit to your core values.';
        const instructionDe = 'Diese evidenzbasierte Akzeptanz-und-Kommittment-Therapie-Übung hilft dir, deine Kernwerte zu identifizieren und ihnen zu verpflichten.';

        const q1TitleEn = 'Life Domains';
        const q1TitleDe = 'Lebensbereiche';
        const q1En = 'Consider different life domains: family, relationships, career, health, spirituality, etc. What matters most in each?';
        const q1De = 'Betrachte verschiedene Lebensbereiche: Familie, Beziehungen, Karriere, Gesundheit, Spiritualität, etc. Was ist in jedem am wichtigsten?';

        const q2TitleEn = 'Values Identification';
        const q2TitleDe = 'Werte Identifikation';
        const q2En = 'Identify your core values in each life domain. What do you want to stand for?';
        const q2De = 'Identifiziere deine Kernwerte in jedem Lebensbereich. Wofür willst du stehen?';

        const q3TitleEn = 'Values vs. Goals';
        const q3TitleDe = 'Werte vs. Ziele';
        const q3En = 'Distinguish between values (directions you want to move toward) and goals (specific outcomes).';
        const q3De = 'Unterscheide zwischen Werten (Richtungen, in die du gehen willst) und Zielen (spezifische Ergebnisse).';

        const q4TitleEn = 'Values-Based Actions';
        const q4TitleDe = 'Wertebasierte Handlungen';
        const q4En = 'What actions can you take today that align with your identified values?';
        const q4De = 'Welche Handlungen kannst du heute unternehmen, die mit deinen identifizierten Werten übereinstimmen?';

        const q5TitleEn = 'Barriers to Values';
        const q5TitleDe = 'Barrieren zu Werten';
        const q5En = 'What thoughts, emotions, or situations prevent you from living according to your values?';
        const q5De = 'Welche Gedanken, Emotionen oder Situationen hindern dich daran, nach deinen Werten zu leben?';

        const q6TitleEn = 'Committed Action';
        const q6TitleDe = 'Verpflichtete Handlung';
        const q6En = 'Create a specific plan to move toward your values despite obstacles.';
        const q6De = 'Erstelle einen spezifischen Plan, um trotz Hindernisse deinen Werten entgegenzugehen.';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="values-q1" placeholder="Consider different life domains and what matters most in each..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="values-q1" placeholder="Betrachte verschiedene Lebensbereiche und was in jedem am wichtigsten ist..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="values-q2" placeholder="Identify your core values in each life domain..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="values-q2" placeholder="Identifiziere deine Kernwerte in jedem Lebensbereich..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="values-q3" placeholder="Distinguish between values and goals..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="values-q3" placeholder="Unterscheide zwischen Werten und Zielen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="values-q4" placeholder="List values-based actions you can take today..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="values-q4" placeholder="Liste wertebasierte Handlungen auf, die du heute unternehmen kannst..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="values-q5" placeholder="Identify barriers to living according to your values..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="values-q5" placeholder="Identifiziere Barrieren für das Leben nach deinen Werten..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="values-q6" placeholder="Create a plan to move toward your values despite obstacles..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="values-q6" placeholder="Erstelle einen Plan, trotz Hindernisse deinen Werten entgegenzugehen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Interpersonal Effectiveness Exercise (DBT-based)
    function createInterpersonalEffectivenessExercise() {
        const titleEn = 'Interpersonal Effectiveness (DBT)';
        const titleDe = 'Zwischenmenschliche Effektivität (DBT)';
        const instructionEn = 'This evidence-based DBT exercise helps improve relationship skills using the DEAR MAN technique.';
        const instructionDe = 'Diese evidenzbasierte DBT-Übung hilft, Beziehungsfähigkeiten mit der DEAR MAN-Technik zu verbessern.';

        const q1TitleEn = 'Describe';
        const q1TitleDe = 'Beschreiben';
        const q1En = 'Describe the situation objectively without opinions or interpretations.';
        const q1De = 'Beschreibe die Situation objektiv ohne Meinungen oder Interpretationen.';

        const q2TitleEn = 'Express';
        const q2TitleDe = 'Ausdrücken';
        const q2En = 'Express your feelings and opinions about the situation.';
        const q2De = 'Drücke deine Gefühle und Meinungen zur Situation aus.';

        const q3TitleEn = 'Assert';
        const q3TitleDe = 'Durchsetzen';
        const q3En = 'Assert your needs or ask for what you want directly.';
        const q3De = 'Setze deine Bedürfnisse durch oder fordere direkt, was du willst.';

        const q4TitleEn = 'Reinforce';
        const q4TitleDe = 'Verstärken';
        const q4En = 'Reinforce the positive consequences for the other person.';
        const q4De = 'Verstärke die positiven Konsequenzen für die andere Person.';

        const q5TitleEn = 'Mindful';
        const q5TitleDe = 'Achtsam';
        const q5En = 'Stay mindful of your objective and don\'t be distracted.';
        const q5De = 'Bleibe achtsam auf dein Ziel und lass dich nicht ablenken.';

        const q6TitleEn = 'Appear Confident';
        const q6TitleDe = 'Wirke selbstsicher';
        const q6En = 'Appear confident through posture, tone, and eye contact.';
        const q6De = 'Wirke selbstsicher durch Haltung, Ton und Augenkontakt.';

        const q7TitleEn = 'Negotiate';
        const q7TitleDe = 'Verhandeln';
        const q7En = 'Negotiate and be willing to give something in return.';
        const q7De = 'Verhandle und sei bereit, etwas im Gegenzug zu geben.';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="relationships-q1" placeholder="Describe the situation objectively..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q1" placeholder="Beschreibe die Situation objektiv..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="relationships-q2" placeholder="Express your feelings and opinions..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q2" placeholder="Drücke deine Gefühle und Meinungen aus..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="relationships-q3" placeholder="Assert your needs or ask for what you want..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q3" placeholder="Setze deine Bedürfnisse durch oder fordere, was du willst..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="relationships-q4" placeholder="Reinforce positive consequences..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q4" placeholder="Verstärke positive Konsequenzen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="relationships-q5" placeholder="Stay mindful of your objective..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q5" placeholder="Bleibe achtsam auf dein Ziel..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="relationships-q6" placeholder="Describe how to appear confident..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q6" placeholder="Beschreibe, wie du selbstsicher wirken kannst..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q7TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q7TitleDe}</h3>
                    <p data-lang="en">${q7En}</p>
                    <p data-lang="de" class="hidden">${q7De}</p>
                    <textarea class="exercise-response" id="relationships-q7" placeholder="Describe how to negotiate effectively..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="relationships-q7" placeholder="Beschreibe, wie du effektiv verhandeln kannst..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Stress & Coping Assessment Exercise
    function createStressCopingAssessmentExercise() {
        const titleEn = 'Stress & Coping Assessment';
        const titleDe = 'Stress & Bewältigungsbeurteilung';
        const instructionEn = 'This evidence-based exercise helps identify stressors and evaluate coping strategies using validated psychological models.';
        const instructionDe = 'Diese evidenzbasierte Übung hilft, Stressfaktoren zu identifizieren und Bewältigungsstrategien mit validierten psychologischen Modellen zu bewerten.';

        const q1TitleEn = 'Stressor Identification';
        const q1TitleDe = 'Stressor Identifikation';
        const q1En = 'Identify specific stressors in your life. Categorize them as acute, chronic, or anticipatory.';
        const q1De = 'Identifiziere spezifische Stressfaktoren in deinem Leben. Kategorisiere sie als akut, chronisch oder antizipatorisch.';

        const q2TitleEn = 'Stress Response';
        const q2TitleDe = 'Stressreaktion';
        const q2En = 'Describe your physical, emotional, and behavioral responses to stress.';
        const q2De = 'Beschreibe deine körperlichen, emotionalen und Verhaltensreaktionen auf Stress.';

        const q3TitleEn = 'Coping Strategies Inventory';
        const q3TitleDe = 'Bewältigungsstrategien Inventar';
        const q3En = 'List all coping strategies you typically use. Categorize as problem-focused or emotion-focused.';
        const q3De = 'Liste alle Bewältigungsstrategien auf, die du typischerweise verwendest. Kategorisiere sie als problemorientiert oder emotionsorientiert.';

        const q4TitleEn = 'Coping Effectiveness';
        const q4TitleDe = 'Bewältigungseffektivität';
        const q4En = 'Rate the effectiveness of each coping strategy (0-10). Which ones are most helpful?';
        const q4De = 'Bewerte die Effektivität jeder Bewältigungsstrategie (0-10). Welche sind am hilfreichsten?';

        const q5TitleEn = 'Coping Mismatch';
        const q5TitleDe = 'Bewältigungsungleichgewicht';
        const q5En = 'Identify situations where your coping strategies don\'t match the stressor type.';
        const q5De = 'Identifiziere Situationen, in denen deine Bewältigungsstrategien nicht zum Stressortyp passen.';

        const q6TitleEn = 'Healthy Alternatives';
        const q6TitleDe = 'Gesunde Alternativen';
        const q6En = 'Identify healthier coping alternatives for each stressor.';
        const q6De = 'Identifiziere gesündere Bewältigungsalternativen für jeden Stressfaktor.';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="stress-q1" placeholder="Identify and categorize your stressors..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="stress-q1" placeholder="Identifiziere und kategorisiere deine Stressfaktoren..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="stress-q2" placeholder="Describe your stress responses..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="stress-q2" placeholder="Beschreibe deine Stressreaktionen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="stress-q3" placeholder="List and categorize your coping strategies..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="stress-q3" placeholder="Liste und kategorisiere deine Bewältigungsstrategien..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="stress-q4" placeholder="Rate the effectiveness of your coping strategies..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="stress-q4" placeholder="Bewerte die Effektivität deiner Bewältigungsstrategien..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="stress-q5" placeholder="Identify mismatches between coping strategies and stressors..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="stress-q5" placeholder="Identifiziere Diskrepanzen zwischen Bewältigungsstrategien und Stressfaktoren..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="stress-q6" placeholder="Identify healthier coping alternatives..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="stress-q6" placeholder="Identifiziere gesündere Bewältigungsalternativen..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Mindfulness Exercise (MBSR-based)
    function createMindfulnessExercise() {
        const titleEn = 'Mindfulness Practice (MBSR)';
        const titleDe = 'Achtsamkeitspraxis (MBSR)';
        const instructionEn = 'This evidence-based Mindfulness-Based Stress Reduction exercise develops present-moment awareness.';
        const instructionDe = 'Diese evidenzbasierte Achtsamkeitsbasierte-Stressreduktion-Übung entwickelt Achtsamkeit im gegenwärtigen Moment.';

        const q1TitleEn = 'Body Scan';
        const q1TitleDe = 'Körperabtastung';
        const q1En = 'Describe your experience during a body scan meditation. What sensations did you notice?';
        const q1De = 'Beschreibe deine Erfahrung während einer Körperabtastungsmeditation. Welche Empfindungen hast du bemerkt?';

        const q2TitleEn = 'Breathing Awareness';
        const q2TitleDe = 'Atembewusstsein';
        const q2En = 'Describe your experience focusing on your breath. How did your mind wander and return?';
        const q2De = 'Beschreibe deine Erfahrung, wenn du dich auf deinen Atem konzentriert hast. Wie ist dein Geist abgeschweift und zurückgekehrt?';

        const q3TitleEn = 'Non-Judgmental Observation';
        const q3TitleDe = 'Nicht-wertende Beobachtung';
        const q3En = 'Practice observing thoughts and feelings without judgment. What did you notice?';
        const q3De = 'Übe das Beobachten von Gedanken und Gefühlen ohne Bewertung. Was hast du bemerkt?';

        const q4TitleEn = 'Mindful Activities';
        const q4TitleDe = 'Achtsame Aktivitäten';
        const q4En = 'Describe how you practiced mindfulness during daily activities (eating, walking, etc.).';
        const q4De = 'Beschreibe, wie du Achtsamkeit während täglicher Aktivitäten geübt hast (Essen, Gehen, etc.).';

        const q5TitleEn = 'Acceptance Practice';
        const q5TitleDe = 'Akzeptanzübung';
        const q5En = 'Describe your experience with accepting difficult emotions or situations without resistance.';
        const q5De = 'Beschreibe deine Erfahrung mit der Akzeptanz schwieriger Emotionen oder Situationen ohne Widerstand.';

        const q6TitleEn = 'Mindfulness Benefits';
        const q6TitleDe = 'Achtsamkeitsvorteile';
        const q6En = 'How did mindfulness practice affect your stress levels, mood, and overall well-being?';
        const q6De = 'Wie hat die Achtsamkeitspraxis deine Stressniveaus, Stimmung und dein allgemeines Wohlbefinden beeinflusst?';

        const finishBtnEn = 'Finish Exercise';
        const finishBtnDe = 'Übung abschließen';

        return `
            <h2 data-lang="en">${titleEn}</h2>
            <h2 data-lang="de" class="hidden">${titleDe}</h2>
            <p class="exercise-instruction" data-lang="en">${instructionEn}</p>
            <p class="exercise-instruction" data-lang="de" class="hidden">${instructionDe}</p>

            <div class="exercise-content">
                <div class="exercise-question">
                    <h3 data-lang="en">${q1TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q1TitleDe}</h3>
                    <p data-lang="en">${q1En}</p>
                    <p data-lang="de" class="hidden">${q1De}</p>
                    <textarea class="exercise-response" id="mindfulness-q1" placeholder="Describe your body scan experience..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="mindfulness-q1" placeholder="Beschreibe deine Körperabtastungserfahrung..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q2TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q2TitleDe}</h3>
                    <p data-lang="en">${q2En}</p>
                    <p data-lang="de" class="hidden">${q2De}</p>
                    <textarea class="exercise-response" id="mindfulness-q2" placeholder="Describe your breathing awareness experience..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="mindfulness-q2" placeholder="Beschreibe deine Atembewusstseinserfahrung..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q3TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q3TitleDe}</h3>
                    <p data-lang="en">${q3En}</p>
                    <p data-lang="de" class="hidden">${q3De}</p>
                    <textarea class="exercise-response" id="mindfulness-q3" placeholder="Describe your non-judgmental observation practice..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="mindfulness-q3" placeholder="Beschreibe deine nicht-wertende Beobachtungspraxis..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q4TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q4TitleDe}</h3>
                    <p data-lang="en">${q4En}</p>
                    <p data-lang="de" class="hidden">${q4De}</p>
                    <textarea class="exercise-response" id="mindfulness-q4" placeholder="Describe mindful daily activities..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="mindfulness-q4" placeholder="Beschreibe achtsame tägliche Aktivitäten..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q5TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q5TitleDe}</h3>
                    <p data-lang="en">${q5En}</p>
                    <p data-lang="de" class="hidden">${q5De}</p>
                    <textarea class="exercise-response" id="mindfulness-q5" placeholder="Describe your acceptance practice..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="mindfulness-q5" placeholder="Beschreibe deine Akzeptanzübung..." data-lang="de"></textarea>
                </div>

                <div class="exercise-question">
                    <h3 data-lang="en">${q6TitleEn}</h3>
                    <h3 data-lang="de" class="hidden">${q6TitleDe}</h3>
                    <p data-lang="en">${q6En}</p>
                    <p data-lang="de" class="hidden">${q6De}</p>
                    <textarea class="exercise-response" id="mindfulness-q6" placeholder="Describe the benefits of mindfulness practice..." data-lang="en"></textarea>
                    <textarea class="exercise-response hidden" id="mindfulness-q6" placeholder="Beschreibe die Vorteile der Achtsamkeitspraxis..." data-lang="de"></textarea>
                </div>

                <div class="exercise-navigation">
                    <button class="exercise-btn" id="finish-exercise" data-lang="en">${finishBtnEn}</button>
                    <button class="exercise-btn hidden" id="finish-exercise" data-lang="de">${finishBtnDe}</button>
                </div>
            </div>
        `;
    }

    // Generate comprehensive scientific psychological report
    function generateScientificReport() {
        // Get all saved exercises
        const savedExercises = JSON.parse(localStorage.getItem('psychologicalExercises')) || [];

        // Get all journal entries
        const journalEntries = JSON.parse(localStorage.getItem('scientificJournal')) || [];

        // Calculate mood trends
        const moodTrends = calculateMoodTrends(journalEntries);

        // Calculate anxiety trends
        const anxietyTrends = calculateAnxietyTrends(journalEntries);

        // Calculate depression trends
        const depressionTrends = calculateDepressionTrends(journalEntries);

        // Calculate stress trends
        const stressTrends = calculateStressTrends(journalEntries);

        // Create report content
        let reportHTML = '';

        if (currentLang === 'en') {
            reportHTML += '<h3>Scientific Psychological Report</h3>';
            reportHTML += `<p><strong>Date Generated:</strong> ${new Date().toLocaleString()}</p>`;

            if (savedExercises.length > 0) {
                reportHTML += '<h3>Completed Evidence-Based Exercises</h3>';
                savedExercises.forEach((exercise, index) => {
                    reportHTML += `<h4>${exercise.type} - ${exercise.date}</h4>`;
                    exercise.responses.forEach((response, qIndex) => {
                        reportHTML += `<p><strong>Question ${qIndex + 1}:</strong> ${response.response}</p>`;
                    });
                });
            } else {
                reportHTML += '<p>No evidence-based exercises completed yet.</p>';
            }

            if (journalEntries.length > 0) {
                reportHTML += '<h3>Psychological Log Entries</h3>';

                // Add trend analysis
                reportHTML += '<div class="report-trend">';
                reportHTML += '<h4>Trend Analysis</h4>';
                reportHTML += `<p><strong>Average Mood:</strong> ${moodTrends.average.toFixed(2)}/10 (Range: ${moodTrends.min} - ${moodTrends.max})</p>`;
                reportHTML += `<p><strong>Average Anxiety:</strong> ${anxietyTrends.average.toFixed(2)}/10 (Range: ${anxietyTrends.min} - ${anxietyTrends.max})</p>`;
                reportHTML += `<p><strong>Average Depression:</strong> ${depressionTrends.average.toFixed(2)}/10 (Range: ${depressionTrends.min} - ${depressionTrends.max})</p>`;
                reportHTML += `<p><strong>Average Stress:</strong> ${stressTrends.average.toFixed(2)}/10 (Range: ${stressTrends.min} - ${stressTrends.max})</p>`;
                reportHTML += `<p><strong>Most Common Emotion:</strong> ${moodTrends.mostCommonEmotion}</p>`;
                reportHTML += '</div>';

                // Add individual entries
                journalEntries.forEach((entry, index) => {
                    reportHTML += `
                        <div class="journal-entry">
                            <div class="journal-entry-header">
                                <div class="journal-entry-date">${entry.date}</div>
                                <div class="journal-entry-meta">
                                    <span class="journal-entry-emotion">Emotion: ${entry.emotion}</span>
                                    <span class="journal-entry-mood">Mood: ${entry.mood}/10</span>
                                    <span class="journal-entry-anxiety">Anxiety: ${entry.anxiety}/10</span>
                                    <span class="journal-entry-depression">Depression: ${entry.depression}/10</span>
                                    <span class="journal-entry-stress">Stress: ${entry.stress}/10</span>
                                </div>
                            </div>
                            <div class="journal-entry-trigger"><strong>Trigger:</strong> ${entry.trigger}</div>
                            <div class="journal-entry-thoughts"><strong>Automatic Thoughts:</strong> ${entry.thoughts}</div>
                            <div class="journal-entry-coping"><strong>Coping Strategy:</strong> ${entry.coping}</div>
                            <div class="journal-entry-content">${entry.content}</div>
                        </div>
                    `;
                });
            } else {
                reportHTML += '<p>No psychological log entries yet.</p>';
            }
        } else {
            reportHTML += '<h3>Wissenschaftlicher psychologischer Bericht</h3>';
            reportHTML += `<p><strong>Datum der Erstellung:</strong> ${new Date().toLocaleString()}</p>`;

            if (savedExercises.length > 0) {
                reportHTML += '<h3>Abgeschlossene evidenzbasierte Übungen</h3>';
                savedExercises.forEach((exercise, index) => {
                    reportHTML += `<h4>${exercise.type} - ${exercise.date}</h4>`;
                    exercise.responses.forEach((response, qIndex) => {
                        reportHTML += `<p><strong>Frage ${qIndex + 1}:</strong> ${response.response}</p>`;
                    });
                });
            } else {
                reportHTML += '<p>Noch keine evidenzbasierten Übungen abgeschlossen.</p>';
            }

            if (journalEntries.length > 0) {
                reportHTML += '<h3>Psychologische Tagebucheinträge</h3>';

                // Add trend analysis in German
                reportHTML += '<div class="report-trend">';
                reportHTML += '<h4>Trendanalyse</h4>';
                reportHTML += `<p><strong>Durchschnittliche Stimmung:</strong> ${moodTrends.average.toFixed(2)}/10 (Bereich: ${moodTrends.min} - ${moodTrends.max})</p>`;
                reportHTML += `<p><strong>Durchschnittliche Angst:</strong> ${anxietyTrends.average.toFixed(2)}/10 (Bereich: ${anxietyTrends.min} - ${anxietyTrends.max})</p>`;
                reportHTML += `<p><strong>Durchschnittliche Depression:</strong> ${depressionTrends.average.toFixed(2)}/10 (Bereich: ${depressionTrends.min} - ${depressionTrends.max})</p>`;
                reportHTML += `<p><strong>Durchschnittlicher Stress:</strong> ${stressTrends.average.toFixed(2)}/10 (Bereich: ${stressTrends.min} - ${stressTrends.max})</p>`;
                reportHTML += `<p><strong>Häufigste Emotion:</strong> ${moodTrends.mostCommonEmotion}</p>`;
                reportHTML += '</div>';

                // Add individual entries
                journalEntries.forEach((entry, index) => {
                    // Get emotion label in German
                    let emotionLabel = entry.emotion;
                    switch(entry.emotion) {
                        case 'joy': emotionLabel = 'Freude'; break;
                        case 'sadness': emotionLabel = 'Traurigkeit'; break;
                        case 'anger': emotionLabel = 'Wut'; break;
                        case 'fear': emotionLabel = 'Angst'; break;
                        case 'surprise': emotionLabel = 'Überraschung'; break;
                        case 'disgust': emotionLabel = 'Ekel'; break;
                        case 'anxiety': emotionLabel = 'Angst'; break;
                        case 'gratitude': emotionLabel = 'Dankbarkeit'; break;
                        case 'contentment': emotionLabel = 'Zufriedenheit'; break;
                        case 'excitement': emotionLabel = 'Begeisterung'; break;
                        case 'confusion': emotionLabel = 'Verwirrung'; break;
                        case 'disappointment': emotionLabel = 'Enttäuschung'; break;
                    }

                    reportHTML += `
                        <div class="journal-entry">
                            <div class="journal-entry-header">
                                <div class="journal-entry-date">${entry.date}</div>
                                <div class="journal-entry-meta">
                                    <span class="journal-entry-emotion">Emotion: ${emotionLabel}</span>
                                    <span class="journal-entry-mood">Stimmung: ${entry.mood}/10</span>
                                    <span class="journal-entry-anxiety">Angst: ${entry.anxiety}/10</span>
                                    <span class="journal-entry-depression">Depression: ${entry.depression}/10</span>
                                    <span class="journal-entry-stress">Stress: ${entry.stress}/10</span>
                                </div>
                            </div>
                            <div class="journal-entry-trigger"><strong>Auslöser:</strong> ${entry.trigger}</div>
                            <div class="journal-entry-thoughts"><strong>Automatische Gedanken:</strong> ${entry.thoughts}</div>
                            <div class="journal-entry-coping"><strong>Bewältigungsstrategie:</strong> ${entry.coping}</div>
                            <div class="journal-entry-content">${entry.content}</div>
                        </div>
                    `;
                });
            } else {
                reportHTML += '<p>Noch keine psychologischen Tagebucheinträge.</p>';
            }
        }

        reportContent.innerHTML = reportHTML;
    }

    // Calculate mood trends
    function calculateMoodTrends(entries) {
        if (entries.length === 0) {
            return { average: 0, min: 0, max: 0, mostCommonEmotion: 'N/A' };
        }

        const moods = entries.map(entry => entry.mood);
        const sum = moods.reduce((acc, val) => acc + val, 0);
        const average = sum / moods.length;
        const min = Math.min(...moods);
        const max = Math.max(...moods);

        // Calculate most common emotion
        const emotionCounts = {};
        entries.forEach(entry => {
            if (emotionCounts[entry.emotion]) {
                emotionCounts[entry.emotion]++;
            } else {
                emotionCounts[entry.emotion] = 1;
            }
        });

        let mostCommonEmotion = '';
        let maxCount = 0;
        for (const [emotion, count] of Object.entries(emotionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommonEmotion = emotion;
            }
        }

        return { average, min, max, mostCommonEmotion };
    }

    // Calculate anxiety trends
    function calculateAnxietyTrends(entries) {
        if (entries.length === 0) {
            return { average: 0, min: 0, max: 0 };
        }

        const anxieties = entries.map(entry => entry.anxiety);
        const sum = anxieties.reduce((acc, val) => acc + val, 0);
        const average = sum / anxieties.length;
        const min = Math.min(...anxieties);
        const max = Math.max(...anxieties);

        return { average, min, max };
    }

    // Calculate depression trends
    function calculateDepressionTrends(entries) {
        if (entries.length === 0) {
            return { average: 0, min: 0, max: 0 };
        }

        const depressions = entries.map(entry => entry.depression);
        const sum = depressions.reduce((acc, val) => acc + val, 0);
        const average = sum / depressions.length;
        const min = Math.min(...depressions);
        const max = Math.max(...depressions);

        return { average, min, max };
    }

    // Calculate stress trends
    function calculateStressTrends(entries) {
        if (entries.length === 0) {
            return { average: 0, min: 0, max: 0 };
        }

        const stresses = entries.map(entry => entry.stress);
        const sum = stresses.reduce((acc, val) => acc + val, 0);
        const average = sum / stresses.length;
        const min = Math.min(...stresses);
        const max = Math.max(...stresses);

        return { average, min, max };
    }

    // Save scientific report to JSON file
    function saveScientificReport() {
        // Get all saved exercises
        const savedExercises = JSON.parse(localStorage.getItem('psychologicalExercises')) || [];

        // Get all journal entries
        const journalEntries = JSON.parse(localStorage.getItem('scientificJournal')) || [];

        // Create report data object
        const reportData = {
            dateGenerated: new Date().toISOString(),
            language: currentLang,
            exercises: savedExercises,
            journalEntries: journalEntries
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(reportData, null, 2);

        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `scientific-psychological-report-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);

        // Show confirmation message
        if (currentLang === 'en') {
            alert('Scientific psychological report saved successfully!');
        } else {
            alert('Wissenschaftlicher psychologischer Bericht erfolgreich gespeichert!');
        }
    }

    // Load scientific report from JSON data
    function loadScientificReport(reportData) {
        // Validate report data
        if (!reportData || !reportData.exercises || !reportData.journalEntries) {
            alert(currentLang === 'en'
                ? 'Invalid report format'
                : 'Ungültiges Berichtsformat');
            return;
        }

        // Save exercises to localStorage
        localStorage.setItem('psychologicalExercises', JSON.stringify(reportData.exercises));

        // Save journal entries to localStorage
        localStorage.setItem('scientificJournal', JSON.stringify(reportData.journalEntries));

        // Update the language if needed
        if (reportData.language && reportData.language !== currentLang) {
            switchLanguage(reportData.language);
        }

        // Show confirmation message
        if (currentLang === 'en') {
            alert('Scientific psychological report loaded successfully! Your data has been restored.');
        } else {
            alert('Wissenschaftlicher psychologischer Bericht erfolgreich geladen! Deine Daten wurden wiederhergestellt.');
        }

        // Update journal display
        displayJournalEntries();

        // Generate new report view
        generateScientificReport();
    }

    // Finish exercise function
    function finishExercise() {
        // Collect responses from the exercise
        const responses = [];
        const responseElements = document.querySelectorAll('.exercise-response:not(.hidden)');

        responseElements.forEach((element, index) => {
            if (element.value) {
                responses.push({
                    question: index + 1,
                    response: element.value
                });
            }
        });

        // Save the exercise results to localStorage
        const exerciseType = document.querySelector('.exercise-content h2:not(.hidden)').textContent;
        const exerciseResults = {
            type: exerciseType,
            date: new Date().toLocaleString(),
            responses: responses
        };

        let savedExercises = JSON.parse(localStorage.getItem('psychologicalExercises')) || [];
        savedExercises.push(exerciseResults);
        localStorage.setItem('psychologicalExercises', JSON.stringify(savedExercises));

        // Show confirmation message in current language
        let confirmationMessage;
        if (currentLang === 'en') {
            confirmationMessage = `Thank you for completing the ${exerciseType} exercise! Your responses have been saved.`;
        } else {
            confirmationMessage = `Vielen Dank, dass du die ${exerciseType} Übung abgeschlossen hast! Deine Antworten wurden gespeichert.`;
        }

        // Show confirmation message
        alert(confirmationMessage);

        // Close the modal
        modal.style.display = 'none';
    }

    // Save journal entry to localStorage
    function saveJournalEntry(text) {
        try {
            // Sanitize all user inputs
            const entry = {
                date: new Date().toLocaleString(),
                content: sanitizeHTML(text),
                mood: parseInt(moodRating.value) || 0,
                emotion: sanitizeHTML(emotionSelect.value),
                trigger: sanitizeHTML(triggerInput.value),
                thoughts: sanitizeHTML(thoughtsInput.value),
                coping: sanitizeHTML(copingStrategy.value),
                anxiety: parseInt(anxietyRating.value) || 0,
                depression: parseInt(depressionRating.value) || 0,
                stress: parseInt(stressRating.value) || 0
            };

            let entries = JSON.parse(localStorage.getItem('scientificJournal')) || [];
            entries.push(entry);
            localStorage.setItem('scientificJournal', JSON.stringify(entries));

            // Update the journal display
            displayJournalEntries();
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert(currentLang === 'en'
                ? 'Error saving journal entry. Please try again.'
                : 'Fehler beim Speichern des Eintrags. Bitte versuche es erneut.');
        }

        // Show confirmation message in current language
        if (currentLang === 'en') {
            alert('Scientific psychological log entry saved successfully!');
        } else {
            alert('Wissenschaftlicher psychologischer Tagebucheintrag erfolgreich gespeichert!');
        }
    }

    // Display journal entries from localStorage
    function displayJournalEntries() {
        const entries = JSON.parse(localStorage.getItem('scientificJournal')) || [];
        journalEntries.innerHTML = '';

        if (entries.length === 0) {
            if (currentLang === 'en') {
                journalEntries.innerHTML = '<p>No scientific psychological log entries yet. Start by making your first entry!</p>';
            } else {
                journalEntries.innerHTML = '<p>Noch keine wissenschaftlichen psychologischen Tagebucheinträge. Beginne mit deinem ersten Eintrag!</p>';
            }
            return;
        }

        // Display entries in reverse chronological order (newest first)
        entries.reverse().forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';

            // Get emotion label in current language
            let emotionLabel = entry.emotion;
            if (currentLang === 'de') {
                switch(entry.emotion) {
                    case 'joy': emotionLabel = 'Freude'; break;
                    case 'sadness': emotionLabel = 'Traurigkeit'; break;
                    case 'anger': emotionLabel = 'Wut'; break;
                    case 'fear': emotionLabel = 'Angst'; break;
                    case 'surprise': emotionLabel = 'Überraschung'; break;
                    case 'disgust': emotionLabel = 'Ekel'; break;
                    case 'anxiety': emotionLabel = 'Angst'; break;
                    case 'gratitude': emotionLabel = 'Dankbarkeit'; break;
                    case 'contentment': emotionLabel = 'Zufriedenheit'; break;
                    case 'excitement': emotionLabel = 'Begeisterung'; break;
                    case 'confusion': emotionLabel = 'Verwirrung'; break;
                    case 'disappointment': emotionLabel = 'Enttäuschung'; break;
                }
            }

            // Get coping strategy label in current language
            let copingLabel = entry.coping;
            if (currentLang === 'de') {
                switch(entry.coping) {
                    case 'problem-solving': copingLabel = 'Problemlösung'; break;
                    case 'mindfulness': copingLabel = 'Achtsamkeit'; break;
                    case 'distraction': copingLabel = 'Ablenkung'; break;
                    case 'exercise': copingLabel = 'Bewegung'; break;
                    case 'social-support': copingLabel = 'Soziale Unterstützung'; break;
                    case 'avoidance': copingLabel = 'Vermeidung'; break;
                    case 'substance-use': copingLabel = 'Substanzgebrauch'; break;
                    case 'other': copingLabel = 'Andere'; break;
                }
            }

            entryElement.innerHTML = `
                <div class="journal-entry-header">
                    <div class="journal-entry-date">${entry.date}</div>
                    <div class="journal-entry-meta">
                        <span class="journal-entry-emotion">${currentLang === 'en' ? 'Emotion:' : 'Emotion:'} ${emotionLabel}</span>
                        <span class="journal-entry-mood">${currentLang === 'en' ? 'Mood:' : 'Stimmung:'} ${entry.mood}/10</span>
                        <span class="journal-entry-anxiety">${currentLang === 'en' ? 'Anxiety:' : 'Angst:'} ${entry.anxiety}/10</span>
                        <span class="journal-entry-depression">${currentLang === 'en' ? 'Depression:' : 'Depression:'} ${entry.depression}/10</span>
                        <span class="journal-entry-stress">${currentLang === 'en' ? 'Stress:' : 'Stress:'} ${entry.stress}/10</span>
                    </div>
                </div>
                ${entry.trigger ? `<div class="journal-entry-trigger"><strong>${currentLang === 'en' ? 'Trigger:' : 'Auslöser:'}</strong> ${entry.trigger}</div>` : ''}
                ${entry.thoughts ? `<div class="journal-entry-thoughts"><strong>${currentLang === 'en' ? 'Automatic Thoughts:' : 'Automatische Gedanken:'}</strong> ${entry.thoughts}</div>` : ''}
                ${entry.coping ? `<div class="journal-entry-coping"><strong>${currentLang === 'en' ? 'Coping Strategy:' : 'Bewältigungsstrategie:'}</strong> ${copingLabel}</div>` : ''}
                <div class="journal-entry-content">${entry.content}</div>
            `;
            journalEntries.appendChild(entryElement);
        });
    }

    // Initialize language and journal entries display
    switchLanguage(currentLang);
    displayJournalEntries();
});