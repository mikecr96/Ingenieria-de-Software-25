// UML 2.5 Presentation Application
class UMLPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 23;
        this.slides = [];
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.loadElements();
        this.generateAllSlides();
        this.bindEvents();
        this.updateUI();
    }
    
    loadElements() {
        this.slidesContainer = document.getElementById('slides-container');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        this.progressFill = document.getElementById('progress-fill');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        // Log elements to debug
        console.log('Elements loaded:', {
            slidesContainer: !!this.slidesContainer,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn
        });
    }
    
    generateAllSlides() {
        // Clear existing slides
        this.slidesContainer.innerHTML = '';
        
        // Generate all slides based on the data
        this.slideData = this.getSlideData();
        
        this.slideData.slides.forEach((slideInfo, index) => {
            const slideElement = this.createSlideElement(slideInfo, index + 1);
            this.slidesContainer.appendChild(slideElement);
        });
        
        // Set first slide as active
        const firstSlide = this.slidesContainer.querySelector('.slide[data-slide="1"]');
        if (firstSlide) {
            firstSlide.classList.add('active');
        }
    }
    
    createSlideElement(slideInfo, slideNumber) {
        const slide = document.createElement('div');
        slide.className = slideNumber === 1 ? 'slide active' : 'slide';
        slide.setAttribute('data-slide', slideNumber);
        
        const content = document.createElement('div');
        content.className = 'slide-content';
        
        // Generate content based on slide type
        switch (slideInfo.type) {
            case 'title':
                content.innerHTML = this.generateTitleSlide(slideInfo);
                content.classList.add('title-slide');
                break;
            case 'agenda':
                content.innerHTML = this.generateAgendaSlide(slideInfo);
                break;
            case 'definition':
                content.innerHTML = this.generateDefinitionSlide(slideInfo);
                break;
            case 'benefits':
                content.innerHTML = this.generateBenefitsSlide(slideInfo);
                break;
            case 'classification':
                content.innerHTML = this.generateClassificationSlide(slideInfo);
                break;
            case 'diagram_explanation':
                content.innerHTML = this.generateDiagramExplanationSlide(slideInfo);
                break;
            case 'recommendations':
                content.innerHTML = this.generateRecommendationsSlide(slideInfo);
                break;
            case 'common_errors':
                content.innerHTML = this.generateCommonErrorsSlide(slideInfo);
                break;
            case 'tools':
                content.innerHTML = this.generateToolsSlide(slideInfo);
                break;
            case 'conclusions':
                content.innerHTML = this.generateConclusionsSlide(slideInfo);
                break;
            default:
                content.innerHTML = this.generateGenericSlide(slideInfo);
                break;
        }
        
        slide.appendChild(content);
        return slide;
    }
    
    generateTitleSlide(slideInfo) {
        return `
            <h1 class="title-main">${slideInfo.title}</h1>
            <h2 class="title-subtitle">${slideInfo.subtitle}</h2>
            <div class="title-course">
                <p>${slideInfo.course}</p>
            </div>
        `;
    }
    
    generateAgendaSlide(slideInfo) {
        const items = slideInfo.content.map(item => 
            `<div class="agenda-item">${item}</div>`
        ).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="agenda-list">${items}</div>
        `;
    }
    
    generateDefinitionSlide(slideInfo) {
        const content = slideInfo.content;
        const keyPoints = [
            content.is_not,
            content.is,
            content.current_version
        ].map(point => `<div class="point">${point}</div>`).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="definition-content">
                <div class="definition-main">${content.definition}</div>
                <div class="definition-main">${content.purpose}</div>
                <div class="key-points">${keyPoints}</div>
            </div>
        `;
    }
    
    generateBenefitsSlide(slideInfo) {
        const benefits = slideInfo.content.map(benefit => 
            `<div class="benefit-item">
                <h4>${benefit.benefit}</h4>
                <p>${benefit.description}</p>
            </div>`
        ).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="benefits-grid">${benefits}</div>
        `;
    }
    
    generateClassificationSlide(slideInfo) {
        const categories = slideInfo.content.categories.map(category => {
            const diagrams = category.diagrams.map(diagram => `<li>${diagram}</li>`).join('');
            return `<div class="category">
                <h4>${category.name}</h4>
                <p class="category-question">${category.question}</p>
                <div class="diagram-list">
                    <ul>${diagrams}</ul>
                </div>
            </div>`;
        }).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="categories">${categories}</div>
        `;
    }
    
    generateDiagramExplanationSlide(slideInfo) {
        const content = slideInfo.content;
        const categoryClass = this.getDiagramCategoryClass(slideInfo.subtitle);
        
        const forWhatItems = content.for_what.map(item => 
            `<li>${item}</li>`
        ).join('');
        
        let imageSection = '';
        if (slideInfo.has_image && slideInfo.image_id) {
            const imageUrl = this.getImageUrl(slideInfo.image_id);
            if (imageUrl) {
                imageSection = `
                    <div class="diagram-example-image">
                        <img src="${imageUrl}" alt="Ejemplo de ${slideInfo.title}" loading="lazy" />
                        <p><em>Ejemplo real de ${slideInfo.title.toLowerCase()}</em></p>
                    </div>
                `;
            }
        }
        
        return `
            <div class="diagram-header">
                <h2 class="slide-title">${slideInfo.title}</h2>
                <div class="slide-subtitle">${slideInfo.subtitle}</div>
            </div>
            <div class="diagram-content">
                <div class="what-section ${categoryClass}">
                    <h3>¿QUÉ ES?</h3>
                    <p>${content.what}</p>
                </div>
                <div class="why-section ${categoryClass}">
                    <h3>¿POR QUÉ USARLO?</h3>
                    <p>${content.why}</p>
                </div>
                <div class="for-what-section ${categoryClass}">
                    <h3>¿PARA QUÉ SIRVE?</h3>
                    <ul class="for-what-list">${forWhatItems}</ul>
                </div>
                <div class="when-section ${categoryClass}">
                    <h3>¿CUÁNDO USARLO?</h3>
                    <p><strong>${content.when}</strong></p>
                </div>
                <div class="example-section ${categoryClass}">
                    <h3>EJEMPLO</h3>
                    <p>${content.example}</p>
                    ${imageSection}
                </div>
            </div>
        `;
    }
    
    generateRecommendationsSlide(slideInfo) {
        const projectTypes = slideInfo.content.project_types.map(project => 
            `<div class="project-type">
                <h4>${project.type}</h4>
                <p>${project.diagrams}</p>
            </div>`
        ).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="slide-subtitle">${slideInfo.subtitle}</div>
            <div class="project-types">${projectTypes}</div>
        `;
    }
    
    generateCommonErrorsSlide(slideInfo) {
        const errors = slideInfo.content.map(error => 
            `<div class="error-item">
                <div class="error-title">${error.error}</div>
                <div class="error-solution">${error.solution}</div>
            </div>`
        ).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="errors-list">${errors}</div>
        `;
    }
    
    generateToolsSlide(slideInfo) {
        const content = slideInfo.content;
        const categories = Object.keys(content).map(key => {
            const category = content[key];
            const tools = category.tools.map(tool => `<li>${tool}</li>`).join('');
            return `
                <div class="tool-category">
                    <h4>${category.title}</h4>
                    <ul>${tools}</ul>
                </div>
            `;
        }).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="tools-categories">${categories}</div>
        `;
    }
    
    generateConclusionsSlide(slideInfo) {
        const conclusions = slideInfo.content.map(conclusion => 
            `<div class="conclusion">${conclusion}</div>`
        ).join('');
        
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="conclusions-list">${conclusions}</div>
        `;
    }
    
    generateGenericSlide(slideInfo) {
        return `
            <h2 class="slide-title">${slideInfo.title}</h2>
            <div class="generic-content">
                <p>Contenido de la diapositiva ${slideInfo.id}</p>
            </div>
        `;
    }
    
    getDiagramCategoryClass(subtitle) {
        if (subtitle && subtitle.includes('ESTRUCTURALES')) {
            return 'structural-category';
        } else if (subtitle && subtitle.includes('COMPORTAMIENTO')) {
            return 'behavioral-category';
        } else if (subtitle && subtitle.includes('INTERACCIÓN')) {
            return 'interaction-category';
        }
        return '';
    }
    
    getImageUrl(imageId) {
        const images = {
            'image:132': 'https://pplx-res.cloudinary.com/image/upload/v1755090484/pplx_project_search_images/aad634c4d09cbbc94c4be147a9e5683730bcae47.png',
            'image:131': 'https://pplx-res.cloudinary.com/image/upload/v1755157756/pplx_project_search_images/23955d5f23e7566af212bbd0cb91a8df1d46ff6d.png',
            'image:135': 'https://pplx-res.cloudinary.com/image/upload/v1755845393/pplx_project_search_images/9ab930bf17ac580f6bbb070177ac503eec6a5e55.png'
        };
        return images[imageId] || null;
    }
    
    bindEvents() {
        // Button navigation - Make sure elements exist before binding
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Previous button clicked');
                this.previousSlide();
            });
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSlide(1);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSlide(this.totalSlides);
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only handle horizontal swipes that are more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
        
        console.log('Events bound successfully');
    }
    
    nextSlide() {
        console.log('Next slide called, current:', this.currentSlide, 'total:', this.totalSlides);
        if (this.isTransitioning || this.currentSlide >= this.totalSlides) return;
        
        this.goToSlide(this.currentSlide + 1);
    }
    
    previousSlide() {
        console.log('Previous slide called, current:', this.currentSlide);
        if (this.isTransitioning || this.currentSlide <= 1) return;
        
        this.goToSlide(this.currentSlide - 1);
    }
    
    goToSlide(slideNumber) {
        console.log('Going to slide:', slideNumber);
        if (this.isTransitioning || slideNumber === this.currentSlide || 
            slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isTransitioning = true;
        
        const currentSlideElement = this.slidesContainer.querySelector('.slide.active');
        const targetSlideElement = this.slidesContainer.querySelector(`[data-slide="${slideNumber}"]`);
        
        if (currentSlideElement && targetSlideElement) {
            // Remove active class from current slide
            currentSlideElement.classList.remove('active');
            
            // Add active class to target slide
            targetSlideElement.classList.add('active');
            
            // Update current slide number
            this.currentSlide = slideNumber;
            
            // Update UI
            this.updateUI();
            
            // Reset transition flag after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 250);
        }
    }
    
    updateUI() {
        // Update slide counter
        if (this.currentSlideSpan && this.totalSlidesSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
        
        // Update progress bar
        if (this.progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
        
        // Update button states
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            
            // Update button text for last slide
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.textContent = 'Finalizar';
            } else {
                this.nextBtn.textContent = 'Siguiente →';
            }
        }
    }
    
    getSlideData() {
        return {
            "slides": [
                {
                    "id": 1,
                    "title": "UML 2.5: Qué, Por Qué y Para Qué",
                    "subtitle": "Los 14 Diagramas Esenciales",
                    "course": "Ingeniería del Software - Capítulo 5",
                    "type": "title"
                },
                {
                    "id": 2,
                    "title": "Agenda",
                    "content": [
                        "Introducción a UML",
                        "Los 14 Diagramas organizados por categorías",
                        "Diagramas Estructurales (7)",
                        "Diagramas de Comportamiento (3)", 
                        "Diagramas de Interacción (4)",
                        "Recomendaciones prácticas",
                        "Conclusiones y herramientas"
                    ],
                    "type": "agenda"
                },
                {
                    "id": 3,
                    "title": "¿Qué es UML?",
                    "content": {
                        "definition": "**Lenguaje visual estándar** para diseñar software",
                        "purpose": "**Propósito fundamental**: Comunicar ideas de software de forma clara",
                        "is_not": "**No es**: Una metodología o proceso de desarrollo",
                        "is": "**Es**: Un vocabulario común entre desarrolladores y stakeholders",
                        "current_version": "**Versión actual**: UML 2.5 (14 diagramas disponibles)"
                    },
                    "type": "definition"
                },
                {
                    "id": 4,
                    "title": "¿Por Qué UML?",
                    "content": [
                        {
                            "benefit": "Comunicación efectiva",
                            "description": "Todos entienden el mismo \"idioma\""
                        },
                        {
                            "benefit": "Documentación visual", 
                            "description": "Vale más que mil líneas de especificaciones"
                        },
                        {
                            "benefit": "Análisis temprano",
                            "description": "Detectar problemas antes de codificar"
                        },
                        {
                            "benefit": "Estándar mundial",
                            "description": "Reconocido en toda la industria"
                        },
                        {
                            "benefit": "Reduces costos",
                            "description": "Menos errores en etapas posteriores"
                        }
                    ],
                    "type": "benefits"
                },
                {
                    "id": 5,
                    "title": "Los 14 Diagramas UML 2.5",
                    "content": {
                        "categories": [
                            {
                                "name": "ESTRUCTURALES (7)",
                                "question": "¿Cómo está organizado el sistema?",
                                "diagrams": ["1. Clases", "2. Objetos", "3. Componentes", "4. Despliegue", "5. Paquetes", "6. Estructura Compuesta", "7. Perfil"]
                            },
                            {
                                "name": "COMPORTAMIENTO (3)",
                                "question": "¿Cómo se comporta el sistema?",
                                "diagrams": ["8. Casos de Uso", "9. Actividad", "10. Estados"]
                            },
                            {
                                "name": "INTERACCIÓN (4)",
                                "question": "¿Cómo se comunican los objetos?",
                                "diagrams": ["11. Secuencia", "12. Comunicación", "13. Tiempo", "14. Interacción General"]
                            }
                        ]
                    },
                    "type": "classification"
                },
                {
                    "id": 6,
                    "title": "1. Diagrama de Clases",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Muestra las clases del sistema y sus relaciones",
                        "why": "Es el núcleo del diseño orientado a objetos", 
                        "for_what": [
                            "Diseñar la estructura del software",
                            "Generar código automáticamente",
                            "Documentar la arquitectura",
                            "Base para otros diagramas"
                        ],
                        "when": "Fase de diseño detallado",
                        "example": "Sistema universitario con clases Estudiante, Profesor, Curso"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 7,
                    "title": "2. Diagrama de Objetos",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Muestra instancias específicas de las clases en un momento dado",
                        "why": "Para entender el estado del sistema en ejecución",
                        "for_what": [
                            "Validar el diseño de clases",
                            "Mostrar datos reales del sistema",
                            "Debugging y análisis",
                            "Documentar casos específicos"
                        ],
                        "when": "Durante testing o análisis de casos específicos",
                        "example": "\"Juan Pérez\" como instancia de la clase Estudiante"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 8,
                    "title": "3. Diagrama de Componentes",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Muestra componentes de software y sus interfaces",
                        "why": "Para diseñar arquitectura de software modular",
                        "for_what": [
                            "Planificar arquitectura de sistema",
                            "Definir interfaces entre módulos",
                            "Organizar equipos de desarrollo",
                            "Documentar dependencias"
                        ],
                        "when": "Diseño arquitectónico",
                        "example": "Frontend, API, Base de datos como componentes separados"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 9,
                    "title": "4. Diagrama de Despliegue",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Muestra dónde se ejecuta físicamente el software",
                        "why": "Para planificar la infraestructura del sistema",
                        "for_what": [
                            "Diseñar arquitectura de servidores",
                            "Planificar recursos de hardware", 
                            "Documentar configuración de producción",
                            "Análisis de rendimiento"
                        ],
                        "when": "Antes del despliegue a producción",
                        "example": "Servidor web, servidor de BD, cliente móvil"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 10,
                    "title": "5. Diagrama de Paquetes",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Organiza elementos del sistema en grupos lógicos",
                        "why": "Para estructurar sistemas grandes y complejos",
                        "for_what": [
                            "Organizar código en módulos",
                            "Manejar dependencias",
                            "Facilitar mantenimiento",
                            "Organizar equipos de trabajo"
                        ],
                        "when": "Arquitectura de sistemas grandes",
                        "example": "Paquetes por capas (UI, Business, Data)"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 11,
                    "title": "6. Diagrama de Estructura Compuesta",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Muestra la estructura interna de una clase compleja",
                        "why": "Para modelar objetos con múltiples partes internas",
                        "for_what": [
                            "Diseñar objetos complejos",
                            "Mostrar colaboraciones internas",
                            "Documentar arquitectura interna", 
                            "Análisis de componentes"
                        ],
                        "when": "Diseño detallado de clases complejas",
                        "example": "Un auto con motor, transmisión, frenos como partes"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 12,
                    "title": "7. Diagrama de Perfil",
                    "subtitle": "DIAGRAMAS ESTRUCTURALES",
                    "content": {
                        "what": "Extiende UML para dominios específicos",
                        "why": "UML básico no cubre todas las necesidades",
                        "for_what": [
                            "Adaptar UML a tecnologías específicas",
                            "Crear estereotipos personalizados",
                            "Añadir restricciones específicas",
                            "Modelado especializado"
                        ],
                        "when": "Proyectos con necesidades muy específicas",
                        "example": "Perfil para desarrollo web con estereotipos <<Controller>>, <<Service>>"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 13,
                    "title": "8. Diagrama de Casos de Uso",
                    "subtitle": "DIAGRAMAS DE COMPORTAMIENTO",
                    "content": {
                        "what": "Muestra qué hace el sistema desde la perspectiva del usuario",
                        "why": "Es la base para entender requisitos funcionales",
                        "for_what": [
                            "Capturar requisitos funcionales",
                            "Comunicar con stakeholders",
                            "Base para casos de prueba",
                            "Planificar desarrollo"
                        ],
                        "when": "Análisis de requisitos (fase temprana)",
                        "example": "Cliente puede \"Consultar saldo\", \"Transferir dinero\""
                    },
                    "type": "diagram_explanation",
                    "has_image": true,
                    "image_id": "image:132"
                },
                {
                    "id": 14,
                    "title": "9. Diagrama de Actividad",
                    "subtitle": "DIAGRAMAS DE COMPORTAMIENTO",
                    "content": {
                        "what": "Muestra flujos de trabajo y procesos paso a paso",
                        "why": "Para entender procesos complejos con decisiones",
                        "for_what": [
                            "Modelar procesos de negocio",
                            "Documentar algoritmos complejos",
                            "Analizar flujos de trabajo",
                            "Optimizar procesos"
                        ],
                        "when": "Análisis de procesos y workflows",
                        "example": "Proceso de aprobación de préstamo con decisiones"
                    },
                    "type": "diagram_explanation",
                    "has_image": true,
                    "image_id": "image:131"
                },
                {
                    "id": 15,
                    "title": "10. Diagrama de Estados",
                    "subtitle": "DIAGRAMAS DE COMPORTAMIENTO", 
                    "content": {
                        "what": "Muestra cómo cambia el estado de un objeto a lo largo del tiempo",
                        "why": "Algunos objetos tienen comportamiento dependiente del estado",
                        "for_what": [
                            "Modelar objetos con ciclo de vida",
                            "Diseñar máquinas de estado",
                            "Validar lógica de negocio",
                            "Controlar transiciones válidas"
                        ],
                        "when": "Objetos con estados bien definidos",
                        "example": "Pedido que va de \"Pendiente\" a \"Pagado\" a \"Enviado\""
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 16,
                    "title": "11. Diagrama de Secuencia",
                    "subtitle": "DIAGRAMAS DE INTERACCIÓN",
                    "content": {
                        "what": "Muestra cómo interactúan los objetos a través del tiempo",
                        "why": "Es el más usado para mostrar flujos detallados",
                        "for_what": [
                            "Diseñar interacciones detalladas",
                            "Documentar flujos críticos",
                            "Análisis de rendimiento",
                            "Base para implementación"
                        ],
                        "when": "Diseño detallado de funcionalidades",
                        "example": "Proceso de login paso a paso"
                    },
                    "type": "diagram_explanation",
                    "has_image": true,
                    "image_id": "image:135"
                },
                {
                    "id": 17,
                    "title": "12. Diagrama de Comunicación",
                    "subtitle": "DIAGRAMAS DE INTERACCIÓN",
                    "content": {
                        "what": "Muestra interacciones enfocándose en la estructura",
                        "why": "Cuando importa MÁS la organización que el tiempo",
                        "for_what": [
                            "Mostrar colaboraciones estructurales",
                            "Análisis de dependencias",
                            "Diseño de arquitectura", 
                            "Documentar relaciones"
                        ],
                        "when": "Cuando el enfoque es estructural, no temporal",
                        "example": "Objetos colaborando sin importar el orden temporal"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 18,
                    "title": "13. Diagrama de Tiempo",
                    "subtitle": "DIAGRAMAS DE INTERACCIÓN",
                    "content": {
                        "what": "Muestra cambios de estado a lo largo de un timeline",
                        "why": "Para sistemas donde el tiempo es crítico",
                        "for_what": [
                            "Análisis de sistemas en tiempo real",
                            "Sincronización de procesos",
                            "Sistemas embebidos",
                            "Protocolos de comunicación"
                        ],
                        "when": "Sistemas con restricciones temporales",
                        "example": "Semáforos que cambian de estado cada X segundos"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 19,
                    "title": "14. Diagrama de Interacción General",
                    "subtitle": "DIAGRAMAS DE INTERACCIÓN",
                    "content": {
                        "what": "Combina diagramas de actividad con referencias a interacciones",
                        "why": "Para mostrar flujos complejos de alto nivel",
                        "for_what": [
                            "Vista de alto nivel de procesos",
                            "Combinar diferentes tipos de diagramas",
                            "Documentar flujos complejos", 
                            "Navegación entre diagramas"
                        ],
                        "when": "Procesos muy complejos con múltiples interacciones",
                        "example": "Proceso de compra que referencia login, pago, envío"
                    },
                    "type": "diagram_explanation"
                },
                {
                    "id": 20,
                    "title": "¿Cuáles Usar?",
                    "subtitle": "RECOMENDACIONES",
                    "content": {
                        "project_types": [
                            {
                                "type": "PROYECTOS PEQUEÑOS",
                                "diagrams": "Casos de Uso + Clases + Secuencia"
                            },
                            {
                                "type": "SISTEMAS EMPRESARIALES", 
                                "diagrams": "+ Componentes + Despliegue + Actividad"
                            },
                            {
                                "type": "SISTEMAS COMPLEJOS",
                                "diagrams": "+ Estados + Paquetes + Comunicación"
                            },
                            {
                                "type": "SISTEMAS EN TIEMPO REAL",
                                "diagrams": "+ Tiempo"
                            },
                            {
                                "type": "PROYECTOS ESPECIALIZADOS",
                                "diagrams": "+ Perfil + Estructura Compuesta"
                            }
                        ]
                    },
                    "type": "recommendations"
                },
                {
                    "id": 21,
                    "title": "Errores Comunes",
                    "content": [
                        {
                            "error": "NO hagas todos los diagramas",
                            "solution": "Solo los que agregan valor"
                        },
                        {
                            "error": "NO modeles TODO",
                            "solution": "Enfócate en lo complejo e importante"
                        },
                        {
                            "error": "NO los hagas al final",
                            "solution": "Úsalos para diseñar, no solo documentar"
                        },
                        {
                            "error": "NO los abandones",
                            "solution": "Mantén sincronizados con el código"
                        },
                        {
                            "error": "NO asumas que todos saben UML",
                            "solution": "Capacita a tu equipo"
                        }
                    ],
                    "type": "common_errors"
                },
                {
                    "id": 22,
                    "title": "Herramientas Recomendadas",
                    "content": {
                        "free_no_register": {
                            "title": "Gratuitas y sin registro",
                            "tools": ["Draw.io", "PlantUML online"]
                        },
                        "open_source": {
                            "title": "Open Source",
                            "tools": ["StarUML", "ArgoUML"]
                        },
                        "commercial": {
                            "title": "Comerciales",
                            "tools": ["Visual Paradigm", "Enterprise Architect"]
                        },
                        "ide_integrated": {
                            "title": "En IDEs",
                            "tools": ["IntelliJ Ultimate", "Eclipse Papyrus"]
                        },
                        "online_paid": {
                            "title": "Online",
                            "tools": ["Lucidchart", "Miro", "Creately"]
                        }
                    },
                    "type": "tools"
                },
                {
                    "id": 23,
                    "title": "Conclusiones",
                    "content": [
                        "**UML es una herramienta**, no un objetivo",
                        "**Úsalo para comunicar y diseñar**, no solo documentar",
                        "**Elige los diagramas apropiados** para cada situación",
                        "**La práctica hace al maestro**: Empieza con los básicos", 
                        "**El valor está en el proceso**, no solo en el resultado"
                    ],
                    "type": "conclusions"
                }
            ]
        };
    }
}

// Initialize the presentation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    new UMLPresentation();
});