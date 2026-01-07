// MINIMALES FUNKTIONIERENDES SCRIPT
console.log('=== SCRIPT STARTET ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ist geladen');

    // Hole ALLE Elemente
    const saveBtn = document.getElementById('save-journal');
    const journalTextarea = document.getElementById('journal-entry');
    const entriesDiv = document.getElementById('journal-entries');

    console.log('Elemente gefunden:');
    console.log('- Save Button:', saveBtn ? 'JA' : 'NEIN');
    console.log('- Textarea:', journalTextarea ? 'JA' : 'NEIN');
    console.log('- Entries Div:', entriesDiv ? 'JA' : 'NEIN');

    // Teste localStorage
    try {
        localStorage.setItem('test', 'works');
        console.log('localStorage: FUNKTIONIERT');
    } catch(e) {
        console.error('localStorage: FEHLER', e);
    }

    // SAVE FUNCTION
    function saveEntry() {
        console.log('>>> SAVE FUNCTION AUFGERUFEN <<<');

        const text = journalTextarea.value.trim();
        console.log('Text:', text);

        if (!text) {
            alert('Bitte Text eingeben!');
            return;
        }

        try {
            // Erstelle Entry
            const entry = {
                date: new Date().toLocaleString(),
                content: text,
                mood: document.getElementById('mood-rating') ? parseInt(document.getElementById('mood-rating').value) : 5
            };

            console.log('Entry erstellt:', entry);

            // Hole bestehende Entries
            let entries = [];
            const stored = localStorage.getItem('scientificJournal');

            if (stored) {
                entries = JSON.parse(stored);
                console.log('Bestehende Entries:', entries.length);
            }

            // Füge neuen Entry hinzu
            entries.push(entry);
            console.log('Neue Anzahl:', entries.length);

            // Speichere
            localStorage.setItem('scientificJournal', JSON.stringify(entries));
            console.log('GESPEICHERT!');

            // Prüfe
            const check = localStorage.getItem('scientificJournal');
            const checkEntries = JSON.parse(check);
            console.log('VERIFIKATION - Entries im Storage:', checkEntries.length);

            // Leere Textfeld
            journalTextarea.value = '';

            // Zeige Entries
            showEntries();

            // Erfolg
            alert('GESPEICHERT! Entries: ' + checkEntries.length);

        } catch (error) {
            console.error('FEHLER:', error);
            alert('FEHLER: ' + error.message);
        }
    }

    // SHOW ENTRIES
    function showEntries() {
        console.log('Zeige Entries...');

        if (!entriesDiv) {
            console.error('Entries Div nicht gefunden!');
            return;
        }

        try {
            const stored = localStorage.getItem('scientificJournal');
            const entries = stored ? JSON.parse(stored) : [];

            console.log('Anzahl Entries:', entries.length);

            if (entries.length === 0) {
                entriesDiv.innerHTML = '<p>Keine Entries vorhanden</p>';
                return;
            }

            // Erstelle HTML
            let html = '';
            const reversed = entries.slice().reverse();

            reversed.forEach((entry, i) => {
                html += '<div class="journal-entry" style="background:#f8fbff;padding:15px;margin:10px 0;border-left:4px solid #4a6fa5;">';
                html += '<div><strong>' + entry.date + '</strong></div>';
                html += '<div>Mood: ' + entry.mood + '/10</div>';
                html += '<div style="margin-top:10px;">' + entry.content + '</div>';
                html += '</div>';
            });

            entriesDiv.innerHTML = html;
            console.log('HTML gesetzt, Entries angezeigt');

        } catch (error) {
            console.error('Fehler beim Anzeigen:', error);
            entriesDiv.innerHTML = '<p style="color:red;">Fehler: ' + error.message + '</p>';
        }
    }

    // EVENT LISTENER
    if (saveBtn) {
        console.log('Füge Event Listener hinzu...');
        saveBtn.addEventListener('click', function(e) {
            console.log('BUTTON GEKLICKT!');
            e.preventDefault();
            saveEntry();
        });
        console.log('Event Listener hinzugefügt');
    } else {
        console.error('SAVE BUTTON NICHT GEFUNDEN!');
    }

    // Zeige beim Start
    showEntries();

    console.log('=== INIT FERTIG ===');
});
