class SoundMaze {
    constructor() {
        this.maze = [];
        this.player = { x: 0, y: 0 };
        this.score = 0;
        this.keys = 0;
        this.currentLevel = 1;
        this.tasks = this.initializeTasks();
        
        this.initializeMaze();
        this.setupEventListeners();
        this.loadProgress();
        this.render();
    }

    initializeTasks() {
        return {
            1: [
                {
                    type: 'speech',
                    word: 'pes',
                    description: 'Vyslov slovo "pes"',
                    hint: 'Začína na P'
                },
                {
                    type: 'speech',
                    word: 'zebra',
                    description: 'Vyslov slovo "zebra"',
                    hint: 'Začína na Z'
                },
                {
                    type: 'speech',
                    word: 'bicykel',
                    description: 'Vyslov slovo "bicykel"',
                    hint: 'Začína na B'
                },
                // Pridajte ďalšie úlohy
            ]
            
        };
    }

    initializeMaze() {
        // Vytvorenie 10x10 bludiska
        for (let i = 0; i < 10; i++) {
            this.maze[i] = [];
            for (let j = 0; j < 10; j++) {
                this.maze[i][j] = {
                    type: 'path',
                    hasTask: Math.random() < 0.2
                };
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        document.getElementById('up').addEventListener('click', () => this.move(0, -1));
        document.getElementById('down').addEventListener('click', () => this.move(0, 1));
        document.getElementById('left').addEventListener('click', () => this.move(-1, 0));
        document.getElementById('right').addEventListener('click', () => this.move(1, 0));
        
        document.getElementById('speak-button').addEventListener('click', () => this.handleSpeech());
    }

    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowUp': this.move(0, -1); break;
            case 'ArrowDown': this.move(0, 1); break;
            case 'ArrowLeft': this.move(-1, 0); break;
            case 'ArrowRight': this.move(1, 0); break;
        }
    }

    move(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (this.isValidMove(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;

            if (this.maze[newY][newX].hasTask) {
                this.showTask();
            }

            this.render();
            this.saveProgress();
        }
    }

    isValidMove(x, y) {
        return x >= 0 && x < 10 && y >= 0 && y < 10;
    }

    showTask() {
        const modal = document.getElementById('task-modal');
        const description = document.getElementById('task-description');
        const currentTask = this.tasks[this.currentLevel][0];

        description.textContent = currentTask.description;
        modal.style.display = 'block';
    }

    handleSpeech() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'sk-SK';
            recognition.onresult = (event) => {
                const speech = event.results[0][0].transcript.toLowerCase();
                const currentTask = this.tasks[this.currentLevel][0];
                
                if (speech === currentTask.word) {
                    this.completeTask();
                }
            };
            recognition.start();
        }
    }

    completeTask() {
        this.score += 10;
        this.keys += 1;
        document.getElementById('score').textContent = this.score;
        document.getElementById('keys').textContent = this.keys;
        
        const modal = document.getElementById('task-modal');
        modal.style.display = 'none';
        
        this.maze[this.player.y][this.player.x].hasTask = false;
        this.saveProgress();
    }

    render() {
        const mazeContainer = document.getElementById('maze');
        mazeContainer.innerHTML = '';

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if (x === this.player.x && y === this.player.y) {
                    cell.classList.add('player');
                }
                
                if (this.maze[y][x].hasTask) {
                    cell.classList.add('task');
                }
                
                mazeContainer.appendChild(cell);
            }
        }
    }

    saveProgress() {
        localStorage.setItem('mazeProgress', JSON.stringify({
            score: this.score,
            keys: this.keys,
            level: this.currentLevel,
            player: this.player
        }));
    }

    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('mazeProgress'));
        if (progress) {
            this.score = progress.score;
            this.keys = progress.keys;
            this.currentLevel = progress.level;
            this.player = progress.player;
            
            document.getElementById('score').textContent = this.score;
            document.getElementById('keys').textContent = this.keys;
        }
    }
}

// Inicializácia hry
const game = new SoundMaze();