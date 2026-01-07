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
        let html = '<h2>Exercise: ' + type + '</h2>';
        html += '<div class="exercise-content">';
        
        // Simple questions for ANY exercise
        for (let i = 1; i <= 5; i++) {
            html += '<div class="exercise-question">';
            html += '<h3>Question ' + i + '</h3>';
            html += '<textarea class="exercise-response" data-question="' + i + '" placeholder="Your answer..."></textarea>';
            html += '</div>';
        }
        
        html += '<button class="exercise-btn" onclick="window.finishExercise(\'' + type + '\')">Finish Exercise</button>';
        html += '</div>';

        elements.exerciseContainer.innerHTML = html;
    }

    // ========================================================================
    // EXERCISES - FINISH (GLOBAL FUNCTION)
    // ========================================================================
    
    window.finishExercise = function(type) {
        console.log('✓ Finishing exercise:', type);

        const responses = [];
        const textareas = elements.exerciseContainer.querySelectorAll('.exercise-response');

        textareas.forEach(ta => {
            const answer = ta.value.trim();
            if (answer) {
                responses.push({
                    question: ta.getAttribute('data-question'),
                    answer: sanitizeHTML(answer)
                });
            }
        });

        if (responses.length === 0) {
            alert(getTranslation(currentLang).fillQuestion);
            return;
        }

        try {
            const exercise = {
                id: Date.now(),
                type: type,
                date: new Date().toLocaleString(),
                responses: responses
            };

            console.log('Exercise data:', exercise);

            // Save
            let exercises = JSON.parse(localStorage.getItem('psychologicalExercises') || '[]');
            exercises.push(exercise);
            localStorage.setItem('psychologicalExercises', JSON.stringify(exercises));

            console.log('✓ Saved! Total exercises:', exercises.length);

            // Close modal
            elements.modal.style.display = 'none';

            // Success
            alert(getTranslation(currentLang).exerciseSaved);

        } catch (error) {
            console.error('❌ Error saving exercise:', error);
            alert('Error: ' + error.message);
        }
    };

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
