// ============================================================================
// SCIENTIFIC PSYCHOLOGICAL LOG JOURNAL - COMPLETE WORKING VERSION
// ============================================================================

console.log('🚀 Script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ DOM loaded');

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    function sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getTranslation(lang) {
        const translations = {
            en: {
                entrySaved: 'Entry saved successfully!',
                exerciseSaved: 'Exercise completed and saved!',
                fillFields: 'Please fill in at least the entry text!',
                fillQuestion: 'Please answer at least one question!',
                reportGenerated: 'Report generated successfully!',
                noData: 'No data available for report.',
                noEntries: 'No entries yet. Start by creating your first entry!'
            },
            de: {
                entrySaved: 'Eintrag erfolgreich gespeichert!',
                exerciseSaved: 'Übung abgeschlossen und gespeichert!',
                fillFields: 'Bitte fülle mindestens das Textfeld aus!',
                fillQuestion: 'Bitte beantworte mindestens eine Frage!',
                reportGenerated: 'Bericht erfolgreich erstellt!',
                noData: 'Keine Daten für Bericht verfügbar.',
                noEntries: 'Noch keine Einträge. Erstelle deinen ersten Eintrag!'
            }
        };
        return translations[lang] || translations.en;
    }

    // ========================================================================
    // STATE
    // ========================================================================
    
    let currentLang = 'en';

    // ========================================================================
    // GET ALL ELEMENTS
    // ========================================================================
    
    const elements = {
        // Language
        langEn: document.getElementById('lang-en'),
        langDe: document.getElementById('lang-de'),
        
        // Journal
        journalEntry: document.getElementById('journal-entry'),
        saveJournal: document.getElementById('save-journal'),
        journalEntries: document.getElementById('journal-entries'),
        moodRating: document.getElementById('mood-rating'),
        moodValue: document.getElementById('mood-value'),
        emotionSelect: document.getElementById('emotion-select'),
        triggerInput: document.getElementById('trigger-input'),
        thoughtsInput: document.getElementById('thoughts-input'),
        copingStrategy: document.getElementById('coping-strategy'),
        anxietyRating: document.getElementById('anxiety-rating'),
        anxietyValue: document.getElementById('anxiety-value'),
        depressionRating: document.getElementById('depression-rating'),
        depressionValue: document.getElementById('depression-value'),
        stressRating: document.getElementById('stress-rating'),
        stressValue: document.getElementById('stress-value'),
        
        // Exercises
        modal: document.getElementById('exercise-modal'),
        closeBtn: document.querySelector('.close'),
        exerciseContainer: document.getElementById('exercise-container'),
        startButtons: document.querySelectorAll('.start-btn'),
        
        // Reports
        generateReport: document.getElementById('generate-report'),
        saveReport: document.getElementById('save-report'),
        loadReportBtn: document.getElementById('load-report-btn'),
        loadReportInput: document.getElementById('load-report'),
        reportContent: document.getElementById('report-content')
    };

    console.log('✓ Elements loaded');

    // ========================================================================
    // SLIDER VALUE UPDATES
    // ========================================================================
    
    if (elements.moodRating && elements.moodValue) {
        elements.moodRating.addEventListener('input', function() {
            elements.moodValue.textContent = this.value;
        });
    }

    if (elements.anxietyRating && elements.anxietyValue) {
        elements.anxietyRating.addEventListener('input', function() {
            elements.anxietyValue.textContent = this.value;
        });
    }

    if (elements.depressionRating && elements.depressionValue) {
        elements.depressionRating.addEventListener('input', function() {
            elements.depressionValue.textContent = this.value;
        });
    }

    if (elements.stressRating && elements.stressValue) {
        elements.stressRating.addEventListener('input', function() {
            elements.stressValue.textContent = this.value;
        });
    }

    // ========================================================================
    // LANGUAGE SWITCHING
    // ========================================================================
    
    function switchLanguage(lang) {
        console.log('Switching to:', lang);
        currentLang = lang;

        // Update buttons
        if (elements.langEn && elements.langDe) {
            if (lang === 'en') {
                elements.langEn.classList.add('active');
                elements.langDe.classList.remove('active');
            } else {
                elements.langDe.classList.add('active');
                elements.langEn.classList.remove('active');
            }
        }

        // Update all language elements
        document.querySelectorAll('[data-lang]').forEach(el => {
            if (el.getAttribute('data-lang') === lang) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    }

    if (elements.langEn) {
        elements.langEn.addEventListener('click', () => switchLanguage('en'));
    }

    if (elements.langDe) {
        elements.langDe.addEventListener('click', () => switchLanguage('de'));
    }

    // ========================================================================
    // JOURNAL ENTRY - SAVE
    // ========================================================================
    
    function saveJournalEntry() {
        console.log('📝 Saving journal entry...');

        const text = elements.journalEntry.value.trim();
        
        if (!text) {
            alert(getTranslation(currentLang).fillFields);
            return;
        }

        try {
            const entry = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                content: sanitizeHTML(text),
                mood: parseInt(elements.moodRating.value) || 5,
                emotion: elements.emotionSelect.value || '',
                trigger: elements.triggerInput.value || '',
                thoughts: elements.thoughtsInput.value || '',
                coping: elements.copingStrategy.value || '',
                anxiety: parseInt(elements.anxietyRating.value) || 0,
                depression: parseInt(elements.depressionRating.value) || 0,
                stress: parseInt(elements.stressRating.value) || 5
            };

            console.log('Entry:', entry);

            // Get existing
            let entries = JSON.parse(localStorage.getItem('scientificJournal') || '[]');
            entries.push(entry);
            
            // Save
            localStorage.setItem('scientificJournal', JSON.stringify(entries));
            
            console.log('✓ Saved! Total entries:', entries.length);

            // Clear form
            elements.journalEntry.value = '';
            elements.triggerInput.value = '';
            elements.thoughtsInput.value = '';

            // Update display
            displayJournalEntries();

            // Success
            alert(getTranslation(currentLang).entrySaved);

        } catch (error) {
            console.error('❌ Error saving:', error);
            alert('Error: ' + error.message);
        }
    }

    if (elements.saveJournal) {
        elements.saveJournal.addEventListener('click', saveJournalEntry);
        console.log('✓ Journal save button connected');
    }

    // ========================================================================
    // JOURNAL ENTRY - DISPLAY
    // ========================================================================
    
    function displayJournalEntries() {
        if (!elements.journalEntries) return;

        try {
            const entries = JSON.parse(localStorage.getItem('scientificJournal') || '[]');
            console.log('📄 Displaying', entries.length, 'entries');

            if (entries.length === 0) {
                elements.journalEntries.innerHTML = '<p>' + getTranslation(currentLang).noEntries + '</p>';
                return;
            }

            let html = '';
            const reversed = entries.slice().reverse();

            reversed.forEach(entry => {
                html += '<div class="journal-entry">';
                html += '<div class="journal-entry-header">';
                html += '<div class="journal-entry-date">' + entry.date + '</div>';
                html += '<div class="journal-entry-meta">';
                html += '<span>Mood: ' + entry.mood + '/10</span>';
                if (entry.emotion) html += '<span>Emotion: ' + entry.emotion + '</span>';
                html += '<span>Anxiety: ' + entry.anxiety + '/10</span>';
                html += '<span>Depression: ' + entry.depression + '/10</span>';
                html += '<span>Stress: ' + entry.stress + '/10</span>';
                html += '</div></div>';
                
                if (entry.trigger) html += '<div class="journal-entry-trigger"><strong>Trigger:</strong> ' + entry.trigger + '</div>';
                if (entry.thoughts) html += '<div class="journal-entry-thoughts"><strong>Thoughts:</strong> ' + entry.thoughts + '</div>';
                if (entry.coping) html += '<div class="journal-entry-coping"><strong>Coping:</strong> ' + entry.coping + '</div>';
                
                html += '<div class="journal-entry-content">' + entry.content + '</div>';
                html += '</div>';
            });

            elements.journalEntries.innerHTML = html;

        } catch (error) {
            console.error('Error displaying entries:', error);
        }
    }

    // ========================================================================
    // EXERCISES - MODAL
    // ========================================================================
    
    if (elements.closeBtn) {
        elements.closeBtn.addEventListener('click', () => {
            if (elements.modal) elements.modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            elements.modal.style.display = 'none';
        }
    });

    // ========================================================================
    // EXERCISES - START
    // ========================================================================
    
    elements.startButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseType = this.getAttribute('data-experiment');
            console.log('🎯 Starting exercise:', exerciseType);
            
            loadExercise(exerciseType);
            elements.modal.style.display = 'block';
        });
    });

    function loadExercise(type) {
        // Exercise questions database
        const exercises = {
            cognitive: {
                title: { en: 'Cognitive Restructuring (CBT)', de: 'Kognitive Umstrukturierung (KVT)' },
                questions: [
                    { en: 'Describe the situation that triggered your emotional response', de: 'Beschreibe die Situation, die deine emotionale Reaktion ausgelöst hat' },
                    { en: 'What emotions did you experience? Rate their intensity (0-100%)', de: 'Welche Emotionen hast du erlebt? Bewerte ihre Intensität (0-100%)' },
                    { en: 'What automatic thoughts went through your mind?', de: 'Welche automatischen Gedanken gingen dir durch den Kopf?' },
                    { en: 'Identify any cognitive distortions (e.g., all-or-nothing thinking, catastrophizing)', de: 'Identifiziere kognitive Verzerrungen (z.B. Schwarz-Weiß-Denken, Katastrophisieren)' },
                    { en: 'What evidence supports or contradicts your thoughts?', de: 'Welche Beweise unterstützen oder widersprechen deinen Gedanken?' },
                    { en: 'What would be a more balanced, realistic thought?', de: 'Was wäre ein ausgewogenerer, realistischerer Gedanke?' }
                ]
            },
            emotions: {
                title: { en: 'Emotional Regulation (DBT)', de: 'Emotionsregulation (DBT)' },
                questions: [
                    { en: 'How is your physical state affecting your emotions?', de: 'Wie beeinflusst dein körperlicher Zustand deine Emotionen?' },
                    { en: 'What factors are increasing your emotional vulnerability?', de: 'Welche Faktoren erhöhen deine emotionale Verletzlichkeit?' },
                    { en: 'Observe your emotions without judgment. What are you feeling?', de: 'Beobachte deine Emotionen ohne Bewertung. Was fühlst du?' },
                    { en: 'What would be the opposite action to your emotional urge?', de: 'Was wäre die gegenteilige Handlung zu deinem emotionalen Drang?' },
                    { en: 'What activities could you do to build positive emotions?', de: 'Welche Aktivitäten könntest du unternehmen, um positive Emotionen aufzubauen?' }
                ]
            },
            behaviors: {
                title: { en: 'Behavioral Activation', de: 'Verhaltensaktivierung' },
                questions: [
                    { en: 'List activities you enjoy or think you might enjoy', de: 'Liste Aktivitäten auf, die du genießt oder genießen könntest' },
                    { en: 'Schedule a pleasant activity. Be specific about when, where, and how', de: 'Plane eine angenehme Aktivität. Sei spezifisch über wann, wo und wie' },
                    { en: 'What activities align with your core values?', de: 'Welche Aktivitäten stimmen mit deinen Kernwerten überein?' },
                    { en: 'What barriers prevent you from engaging in pleasant activities?', de: 'Welche Barrieren verhindern die Teilnahme an angenehmen Aktivitäten?' },
                    { en: 'How can you overcome these barriers? Create an action plan', de: 'Wie kannst du diese Barrieren überwinden? Erstelle einen Aktionsplan' }
                ]
            },
            beliefs: {
                title: { en: 'Core Belief Exploration', de: 'Kernüberzeugungen Erforschung' },
                questions: [
                    { en: 'What early memories shaped your core beliefs?', de: 'Welche frühen Erinnerungen prägten deine Kernüberzeugungen?' },
                    { en: 'What are your core beliefs about yourself?', de: 'Was sind deine Kernüberzeugungen über dich selbst?' },
                    { en: 'What are your core beliefs about others?', de: 'Was sind deine Kernüberzeugungen über andere?' },
                    { en: 'What situations trigger your core beliefs?', de: 'Welche Situationen lösen deine Kernüberzeugungen aus?' },
                    { en: 'How do these beliefs affect your behavior?', de: 'Wie beeinflussen diese Überzeugungen dein Verhalten?' }
                ]
            },
            values: {
                title: { en: 'Values Clarification (ACT)', de: 'Werteklärung (AKT)' },
                questions: [
                    { en: 'What matters most in different life domains (family, work, health)?', de: 'Was ist in verschiedenen Lebensbereichen am wichtigsten (Familie, Arbeit, Gesundheit)?' },
                    { en: 'Identify your core values. What do you want to stand for?', de: 'Identifiziere deine Kernwerte. Wofür willst du stehen?' },
                    { en: 'Distinguish between values (directions) and goals (outcomes)', de: 'Unterscheide zwischen Werten (Richtungen) und Zielen (Ergebnisse)' },
                    { en: 'What actions can you take today that align with your values?', de: 'Welche Handlungen kannst du heute unternehmen, die mit deinen Werten übereinstimmen?' },
                    { en: 'What prevents you from living according to your values?', de: 'Was hindert dich daran, nach deinen Werten zu leben?' }
                ]
            },
            relationships: {
                title: { en: 'Interpersonal Effectiveness (DBT)', de: 'Zwischenmenschliche Effektivität (DBT)' },
                questions: [
                    { en: 'Describe a recent interpersonal challenge', de: 'Beschreibe eine aktuelle zwischenmenschliche Herausforderung' },
                    { en: 'What is your objective in this relationship situation?', de: 'Was ist dein Ziel in dieser Beziehungssituation?' },
                    { en: 'How can you be effective while maintaining self-respect?', de: 'Wie kannst du effektiv sein und gleichzeitig Selbstrespekt bewahren?' },
                    { en: 'Practice assertiveness: What do you need to say?', de: 'Übe Durchsetzungsvermögen: Was musst du sagen?' },
                    { en: 'How can you validate the other person while expressing your needs?', de: 'Wie kannst du die andere Person validieren und deine Bedürfnisse ausdrücken?' }
                ]
            },
            stress: {
                title: { en: 'Stress & Coping Assessment', de: 'Stress & Bewältigungsbeurteilung' },
                questions: [
                    { en: 'Identify your current stressors', de: 'Identifiziere deine aktuellen Stressfaktoren' },
                    { en: 'Rate your stress level (0-10) and describe physical symptoms', de: 'Bewerte dein Stressniveau (0-10) und beschreibe körperliche Symptome' },
                    { en: 'What coping strategies have you used?', de: 'Welche Bewältigungsstrategien hast du verwendet?' },
                    { en: 'Which strategies were helpful vs. unhelpful?', de: 'Welche Strategien waren hilfreich vs. nicht hilfreich?' },
                    { en: 'What new coping strategies could you try?', de: 'Welche neuen Bewältigungsstrategien könntest du versuchen?' }
                ]
            },
            mindfulness: {
                title: { en: 'Mindfulness Practice (MBSR)', de: 'Achtsamkeitspraxis (MBSR)' },
                questions: [
                    { en: 'Describe your experience with body scan meditation', de: 'Beschreibe deine Erfahrung mit Körperabtastungsmeditation' },
                    { en: 'How did focusing on your breath affect your mind?', de: 'Wie hat die Konzentration auf deinen Atem deinen Geist beeinflusst?' },
                    { en: 'Practice observing thoughts without judgment. What did you notice?', de: 'Übe das Beobachten von Gedanken ohne Bewertung. Was hast du bemerkt?' },
                    { en: 'Describe mindful activities you practiced today', de: 'Beschreibe achtsame Aktivitäten, die du heute geübt hast' },
                    { en: 'How did mindfulness affect your stress and well-being?', de: 'Wie hat Achtsamkeit dein Stress und Wohlbefinden beeinflusst?' }
                ]
            }
        };

        // Get exercise or use default
        const exercise = exercises[type] || {
            title: { en: 'Exercise: ' + type, de: 'Übung: ' + type },
            questions: [
                { en: 'Question 1', de: 'Frage 1' },
                { en: 'Question 2', de: 'Frage 2' },
                { en: 'Question 3', de: 'Frage 3' }
            ]
        };

        // Build HTML
        let html = '<h2>' + exercise.title[currentLang] + '</h2>';
        html += '<div class="exercise-content">';

        exercise.questions.forEach((q, i) => {
            html += '<div class="exercise-question">';
            html += '<h3>' + (i + 1) + '. ' + q[currentLang] + '</h3>';
            html += '<textarea class="exercise-response" data-question="' + (i + 1) + '" placeholder="' + (currentLang === 'en' ? 'Your answer...' : 'Deine Antwort...') + '"></textarea>';
            html += '</div>';
        });

        html += '<button class="exercise-btn" id="finish-exercise-btn">';
        html += currentLang === 'en' ? 'Finish Exercise' : 'Übung abschließen';
        html += '</button>';
        html += '</div>';

        elements.exerciseContainer.innerHTML = html;

        // Add event listener
        const finishBtn = document.getElementById('finish-exercise-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', function() {
                console.log('🔘 Finish button clicked!');
                finishExercise(type);
            });
            console.log('✓ Finish button listener added for:', type);
        }
    }

    // ========================================================================
    // EXERCISES - FINISH
    // ========================================================================

    function finishExercise(type) {
        console.log('📝 Finishing exercise:', type);

        const responses = [];
        const textareas = elements.exerciseContainer.querySelectorAll('.exercise-response');

        console.log('Found textareas:', textareas.length);

        // Collect all answers
        textareas.forEach((ta, index) => {
            const answer = ta.value.trim();
            console.log('Question ' + (index + 1) + ':', answer ? 'FILLED' : 'EMPTY');

            if (answer) {
                responses.push({
                    question: ta.getAttribute('data-question') || (index + 1),
                    answer: sanitizeHTML(answer)
                });
            }
        });

        console.log('Total responses:', responses.length);

        // Validation
        if (responses.length === 0) {
            console.warn('⚠️ No responses provided');
            alert(getTranslation(currentLang).fillQuestion);
            return;
        }

        // Save exercise
        try {
            const exercise = {
                id: Date.now(),
                type: type,
                date: new Date().toLocaleString(),
                responses: responses,
                totalQuestions: textareas.length,
                answeredQuestions: responses.length
            };

            console.log('💾 Saving exercise:', exercise);

            // Get existing exercises
            let exercises = JSON.parse(localStorage.getItem('psychologicalExercises') || '[]');
            exercises.push(exercise);

            // Save to localStorage
            localStorage.setItem('psychologicalExercises', JSON.stringify(exercises));

            console.log('✅ Saved! Total exercises:', exercises.length);

            // Close modal
            if (elements.modal) {
                elements.modal.style.display = 'none';
            }

            // Success message
            const message = currentLang === 'en'
                ? 'Exercise completed and saved!\nAnswered: ' + responses.length + ' of ' + textareas.length + ' questions'
                : 'Übung abgeschlossen und gespeichert!\nBeantwortet: ' + responses.length + ' von ' + textareas.length + ' Fragen';

            alert(message);

        } catch (error) {
            console.error('❌ Error saving exercise:', error);
            alert('Error: ' + error.message);
        }
    }

    // ========================================================================
    // REPORTS - GENERATE
    // ========================================================================
    
    function generateReport() {
        console.log('📊 Generating report...');

        try {
            const entries = JSON.parse(localStorage.getItem('scientificJournal') || '[]');
            const exercises = JSON.parse(localStorage.getItem('psychologicalExercises') || '[]');

            if (entries.length === 0 && exercises.length === 0) {
                alert(getTranslation(currentLang).noData);
                return;
            }

            let html = '<h3>Scientific Psychological Report</h3>';
            html += '<p><strong>Generated:</strong> ' + new Date().toLocaleString() + '</p>';

            // Journal summary
            if (entries.length > 0) {
                const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
                const avgAnxiety = entries.reduce((sum, e) => sum + e.anxiety, 0) / entries.length;
                const avgDepression = entries.reduce((sum, e) => sum + e.depression, 0) / entries.length;
                const avgStress = entries.reduce((sum, e) => sum + e.stress, 0) / entries.length;

                html += '<div class="report-trend">';
                html += '<h4>Journal Entries (' + entries.length + ')</h4>';
                html += '<p>Average Mood: ' + avgMood.toFixed(1) + '/10</p>';
                html += '<p>Average Anxiety: ' + avgAnxiety.toFixed(1) + '/10</p>';
                html += '<p>Average Depression: ' + avgDepression.toFixed(1) + '/10</p>';
                html += '<p>Average Stress: ' + avgStress.toFixed(1) + '/10</p>';
                html += '</div>';
            }

            // Exercise summary
            if (exercises.length > 0) {
                html += '<div class="report-trend">';
                html += '<h4>Completed Exercises (' + exercises.length + ')</h4>';
                exercises.forEach((ex, i) => {
                    html += '<p><strong>' + (i+1) + '. ' + ex.type + '</strong> - ' + ex.date + '</p>';
                });
                html += '</div>';
            }

            elements.reportContent.innerHTML = html;
            alert(getTranslation(currentLang).reportGenerated);

        } catch (error) {
            console.error('❌ Error generating report:', error);
            alert('Error: ' + error.message);
        }
    }

    if (elements.generateReport) {
        elements.generateReport.addEventListener('click', generateReport);
        console.log('✓ Report button connected');
    }

    // ========================================================================
    // REPORTS - SAVE
    // ========================================================================
    
    function saveReport() {
        try {
            const data = {
                date: new Date().toISOString(),
                entries: JSON.parse(localStorage.getItem('scientificJournal') || '[]'),
                exercises: JSON.parse(localStorage.getItem('psychologicalExercises') || '[]')
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'psychological-report-' + Date.now() + '.json';
            a.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error saving report:', error);
        }
    }

    if (elements.saveReport) {
        elements.saveReport.addEventListener('click', saveReport);
    }

    // ========================================================================
    // INITIALIZE
    // ========================================================================
    
    switchLanguage('en');
    displayJournalEntries();

    console.log('✅ Initialization complete!');
    console.log('📦 Storage:', {
        entries: JSON.parse(localStorage.getItem('scientificJournal') || '[]').length,
        exercises: JSON.parse(localStorage.getItem('psychologicalExercises') || '[]').length
    });
});
