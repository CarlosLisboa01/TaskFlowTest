/**
 * TASKFLOW - FUNCIONALIDADE RESPONSIVA
 * Gerencia o menu hambúrguer e a navegação responsiva
 */

class ResponsiveManager {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburger-menu');
        this.sidebar = document.getElementById('sidebar-nav');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.closeSidebar = document.getElementById('close-sidebar');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResize();
        this.setupKeyboardNavigation();
        this.checkInitialState();
    }

    bindEvents() {
        // Evento do botão hambúrguer
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }

        // Evento do overlay (fechar menu)
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Evento do botão fechar
        if (this.closeSidebar) {
            this.closeSidebar.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Fechar menu ao clicar em links de navegação (em mobile)
        const navItems = this.sidebar?.querySelectorAll('.nav-item');
        if (navItems) {
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMenu();
                    }
                });
            });
        }

        // Evento de redimensionamento da janela
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        
        // Adicionar classes ativas
        this.hamburgerMenu?.classList.add('active');
        this.sidebar?.classList.add('active');
        this.menuOverlay?.classList.add('active');
        
        // Atualizar atributos de acessibilidade
        this.hamburgerMenu?.setAttribute('aria-expanded', 'true');
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        // Focar no primeiro item do menu
        this.focusFirstMenuItem();
    }

    closeMenu() {
        this.isMenuOpen = false;
        
        // Remover classes ativas
        this.hamburgerMenu?.classList.remove('active');
        this.sidebar?.classList.remove('active');
        this.menuOverlay?.classList.remove('active');
        
        // Atualizar atributos de acessibilidade
        this.hamburgerMenu?.setAttribute('aria-expanded', 'false');
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        // Retornar foco ao botão hambúrguer
        this.hamburgerMenu?.focus();
    }

    handleResize() {
        // Fechar menu se a tela for redimensionada para desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
            document.body.style.overflow = '';
        }
        
        // Mostrar/ocultar dica de scroll da tabela
        this.toggleTableScrollHint();
    }

    toggleTableScrollHint() {
        const tableContainer = document.querySelector('.tasks-table-container');
        const scrollHint = document.getElementById('table-scroll-hint');
        const table = document.querySelector('.tasks-table');
        
        if (tableContainer && scrollHint && table) {
            const containerWidth = tableContainer.clientWidth;
            const tableWidth = table.scrollWidth;
            
            // Mostrar dica se a tabela é maior que o container e estamos em mobile
            if (tableWidth > containerWidth && window.innerWidth <= 768) {
                scrollHint.style.display = 'flex';
                
                // Ocultar dica após alguns segundos de inatividade
                this.hideScrollHintAfterDelay();
            } else {
                scrollHint.style.display = 'none';
            }
        }
    }

    hideScrollHintAfterDelay() {
        const scrollHint = document.getElementById('table-scroll-hint');
        const tableContainer = document.querySelector('.tasks-table-container');
        
        if (scrollHint && tableContainer) {
            let scrollTimeout;
            
            const hideHint = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    scrollHint.style.opacity = '0.5';
                }, 3000);
            };
            
            const showHint = () => {
                clearTimeout(scrollTimeout);
                scrollHint.style.opacity = '1';
                hideHint();
            };
            
            tableContainer.addEventListener('scroll', showHint);
            tableContainer.addEventListener('touchstart', showHint);
            
            // Iniciar o timer
            hideHint();
        }
    }

    setupKeyboardNavigation() {
        // Configurar navegação por teclado no sidebar
        const navItems = this.sidebar?.querySelectorAll('.nav-item, .logout-btn');
        
        if (navItems) {
            navItems.forEach((item, index) => {
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = navItems[index + 1] || navItems[0];
                        nextItem.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = navItems[index - 1] || navItems[navItems.length - 1];
                        prevItem.focus();
                    }
                });
            });
        }
    }

    handleKeyboard(e) {
        // Fechar menu com ESC
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMenu();
        }
        
        // Abrir menu com F2 (atalho de acessibilidade)
        if (e.key === 'F2' && !this.isMenuOpen && window.innerWidth <= 768) {
            e.preventDefault();
            this.openMenu();
        }
    }

    focusFirstMenuItem() {
        const firstNavItem = this.sidebar?.querySelector('.nav-item');
        if (firstNavItem && this.isMenuOpen) {
            setTimeout(() => {
                firstNavItem.focus();
            }, 300); // Aguardar animação da sidebar
        }
    }

    checkInitialState() {
        // Verificar se o menu deve estar fechado na inicialização
        if (window.innerWidth <= 768) {
            this.closeMenu();
        }
        
        // Configurar estado inicial da dica de scroll
        setTimeout(() => {
            this.toggleTableScrollHint();
        }, 500);
    }

    // Método público para outras partes da aplicação
    static getInstance() {
        if (!ResponsiveManager.instance) {
            ResponsiveManager.instance = new ResponsiveManager();
        }
        return ResponsiveManager.instance;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que todos os elementos estejam disponíveis
    setTimeout(() => {
        ResponsiveManager.getInstance();
    }, 100);
});

// Exportar para uso em outros módulos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
}

/**
 * UTILITÁRIOS ADICIONAIS PARA RESPONSIVIDADE
 */

// Função para detectar se estamos em dispositivo touch
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

// Função para detectar se estamos em mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para detectar se estamos em tablet
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Adicionar classes CSS baseadas no dispositivo
function addDeviceClasses() {
    const body = document.body;
    
    if (isTouchDevice()) {
        body.classList.add('touch-device');
    }
    
    if (isMobile()) {
        body.classList.add('mobile-device');
    } else if (isTablet()) {
        body.classList.add('tablet-device');
    } else {
        body.classList.add('desktop-device');
    }
}

// Executar na inicialização
document.addEventListener('DOMContentLoaded', addDeviceClasses);

// Reexecutar no redimensionamento
window.addEventListener('resize', () => {
    // Remover classes existentes
    document.body.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
    // Adicionar novamente
    addDeviceClasses();
});

/**
 * GERENCIAMENTO DE MODAIS RESPONSIVOS
 */

// Função para melhorar a experiência de scroll em modais
function improveModalScroll() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const modalContent = modal.querySelector('.modal-content');
        
        if (modalContent) {
            // Verificar se o modal precisa de scroll
            const checkScrollNeed = () => {
                const hasVerticalScroll = modalContent.scrollHeight > modalContent.clientHeight;
                
                if (hasVerticalScroll) {
                    modalContent.classList.add('has-scroll');
                } else {
                    modalContent.classList.remove('has-scroll');
                }
            };
            
            // Observer para mudanças no conteúdo do modal
            const resizeObserver = new ResizeObserver(checkScrollNeed);
            resizeObserver.observe(modalContent);
            
            // Listener para mudanças na abertura do modal
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (modal.classList.contains('active')) {
                            setTimeout(checkScrollNeed, 100);
                        }
                    }
                });
            });
            
            mutationObserver.observe(modal, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // Melhorar o scroll em dispositivos móveis
            modalContent.addEventListener('touchstart', function(e) {
                const startY = e.touches[0].pageY;
                const scrollTop = modalContent.scrollTop;
                const scrollHeight = modalContent.scrollHeight;
                const offsetHeight = modalContent.offsetHeight;
                
                if (scrollTop === 0 && e.touches[0].pageY > startY) {
                    e.preventDefault();
                } else if (scrollTop + offsetHeight >= scrollHeight && e.touches[0].pageY < startY) {
                    e.preventDefault();
                }
            });
            
            // Indicador de scroll suave
            let scrollTimeout;
            modalContent.addEventListener('scroll', () => {
                modalContent.style.setProperty('--scroll-indicator-opacity', '1');
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    modalContent.style.setProperty('--scroll-indicator-opacity', '0.3');
                }, 1000);
            });
        }
    });
}

// Função para ajustar altura do modal em mobile
function adjustModalHeightOnMobile() {
    if (isMobile()) {
        const modals = document.querySelectorAll('.modal-content');
        
        modals.forEach(modalContent => {
            // Ajustar altura máxima baseada na altura da viewport
            const viewportHeight = window.innerHeight;
            const safeAreaTop = 30; // Espaço para o menu hambúrguer
            const safeAreaBottom = 20; // Espaço inferior
            const maxHeight = viewportHeight - safeAreaTop - safeAreaBottom;
            
            modalContent.style.maxHeight = `${maxHeight}px`;
        });
    }
}

// Inicializar melhorias dos modais
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        improveModalScroll();
        adjustModalHeightOnMobile();
    }, 200);
});

// Reajustar em mudanças de orientação
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        adjustModalHeightOnMobile();
        improveCalendarScroll();
    }, 500);
});

/**
 * MELHORIAS ESPECÍFICAS PARA O CALENDÁRIO
 */

// Função para melhorar o scroll do calendário em mobile
function improveCalendarScroll() {
    // Verificar se estamos na página do calendário
    const calendarContainer = document.querySelector('.calendar-container');
    const mainContent = document.querySelector('.main-content');
    
    if (calendarContainer && isMobile()) {
        // Garantir que o main-content tenha scroll suave
        if (mainContent) {
            mainContent.style.scrollBehavior = 'smooth';
            mainContent.style.overflowY = 'auto';
        }
        
        // Ajustar altura do calendário dinamicamente
        adjustCalendarHeight();
        
        // Adicionar indicador de scroll se necessário
        addCalendarScrollIndicator();
        
        // Melhorar navegação touch no calendário
        improveTouchNavigation();
    }
}

// Função para ajustar altura do calendário
function adjustCalendarHeight() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const mainContent = document.querySelector('.main-content');
    const taskHeader = document.querySelector('.task-header');
    const calendarLegend = document.querySelector('.calendar-legend');
    
    if (calendarGrid && mainContent && isMobile()) {
        const headerHeight = taskHeader ? taskHeader.offsetHeight : 0;
        const legendHeight = calendarLegend ? calendarLegend.offsetHeight : 0;
        const viewportHeight = window.innerHeight;
        const menuBarHeight = 80; // Altura do menu hambúrguer
        const padding = 40; // Padding adicional
        
        const availableHeight = viewportHeight - menuBarHeight - headerHeight - legendHeight - padding;
        
        // Não forçar altura mínima muito grande em mobile
        if (availableHeight > 300) {
            calendarGrid.style.minHeight = `${Math.min(availableHeight, 500)}px`;
        }
    }
}

// Função para adicionar indicador de scroll
function addCalendarScrollIndicator() {
    const mainContent = document.querySelector('.main-content');
    let scrollIndicator = document.querySelector('.calendar-scroll-indicator');
    
    if (mainContent && !scrollIndicator && isMobile()) {
        scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'calendar-scroll-indicator';
        scrollIndicator.innerHTML = '↓ Role para ver mais ↓';
        
        const calendarContainer = document.querySelector('.calendar-container');
        if (calendarContainer) {
            calendarContainer.appendChild(scrollIndicator);
        }
        
        // Ocultar/mostrar indicador baseado no scroll
        let scrollTimeout;
        mainContent.addEventListener('scroll', () => {
            const scrollTop = mainContent.scrollTop;
            const scrollHeight = mainContent.scrollHeight;
            const clientHeight = mainContent.clientHeight;
            
            const isNearTop = scrollTop < 50;
            const isNearBottom = scrollTop + clientHeight > scrollHeight - 50;
            
            if (scrollIndicator) {
                if (isNearTop && !isNearBottom) {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.innerHTML = '↓ Role para ver mais ↓';
                } else if (isNearBottom && !isNearTop) {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.innerHTML = '↑ Role para cima ↑';
                } else {
                    scrollIndicator.style.opacity = '0.3';
                }
                
                // Fade out após inatividade
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    scrollIndicator.style.opacity = '0.1';
                }, 2000);
            }
        });
    }
}

// Função para melhorar navegação touch
function improveTouchNavigation() {
    const calendarDays = document.querySelectorAll('.calendar-day');
    const calendarTasks = document.querySelectorAll('.calendar-task');
    
    // Melhorar feedback visual para células do calendário
    calendarDays.forEach(day => {
        day.addEventListener('touchstart', function() {
            this.style.backgroundColor = 'rgba(123, 104, 238, 0.1)';
        });
        
        day.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 150);
        });
    });
    
    // Melhorar feedback para tasks
    calendarTasks.forEach(task => {
        task.addEventListener('touchstart', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });
        
        task.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
                this.style.zIndex = '';
            }, 150);
        });
    });
}

// Função para otimizar controles de navegação do calendário
function optimizeCalendarControls() {
    const calendarControls = document.querySelector('.calendar-controls');
    const navButtons = document.querySelectorAll('.calendar-nav-btn');
    
    if (calendarControls && isMobile()) {
        // Melhorar área de toque dos botões
        navButtons.forEach(btn => {
            btn.style.minWidth = '44px';
            btn.style.minHeight = '44px';
            
            // Adicionar feedback visual
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
        
        // Tornar título do calendário mais legível
        const calendarTitle = document.getElementById('calendar-title');
        if (calendarTitle) {
            calendarTitle.style.fontSize = isMobile() ? '1rem' : '1.2rem';
            calendarTitle.style.padding = '0 10px';
        }
    }
}

// Função para detectar mudanças no calendário e reajustar
function setupCalendarObserver() {
    const calendarGrid = document.querySelector('.calendar-grid');
    
    if (calendarGrid) {
        const observer = new MutationObserver(() => {
            if (isMobile()) {
                setTimeout(() => {
                    adjustCalendarHeight();
                    improveTouchNavigation();
                }, 100);
            }
        });
        
        observer.observe(calendarGrid, {
            childList: true,
            subtree: true
        });
    }
}

// Inicializar melhorias específicas do calendário
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.querySelector('.calendar-container')) {
            improveCalendarScroll();
            optimizeCalendarControls();
            setupCalendarObserver();
        }
    }, 300);
});

// Reajustar em redimensionamento
window.addEventListener('resize', () => {
    if (document.querySelector('.calendar-container')) {
        setTimeout(() => {
            improveCalendarScroll();
            optimizeCalendarControls();
        }, 100);
    }
}); 