/**
 * TASKFLOW - FUNCIONALIDADES MODERNAS DE LOGIN
 * Gerencia funcionalidades avançadas da tela de login
 */

class ModernLoginManager {
    constructor() {
        this.passwordToggles = [];
        this.forms = {};
        this.validation = {};
        
        this.init();
    }

    init() {
        this.setupPasswordToggles();
        this.setupFormValidation();
        this.setupMobileToggles();
        this.setupLoadingStates();
        this.setupKeyboardNavigation();
    }

    // Configurar toggles de senha
    setupPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        
        toggles.forEach(toggle => {
            const input = toggle.previousElementSibling || toggle.parentElement.querySelector('input');
            
            if (input) {
                toggle.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    
                    const icon = toggle.querySelector('i');
                    icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                    
                    toggle.setAttribute('aria-label', 
                        isPassword ? 'Ocultar senha' : 'Mostrar senha'
                    );
                });
            }
        });
    }

    // Configurar validação de formulários
    setupFormValidation() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            this.setupLoginValidation(loginForm);
        }
        
        if (registerForm) {
            this.setupRegisterValidation(registerForm);
        }
    }

    setupLoginValidation(form) {
        const emailInput = form.querySelector('#login-email');
        const passwordInput = form.querySelector('#login-password');
        
        emailInput?.addEventListener('blur', () => {
            this.validateEmail(emailInput, 'email-error');
        });
        
        emailInput?.addEventListener('input', () => {
            this.clearError(emailInput, 'email-error');
        });
        
        passwordInput?.addEventListener('blur', () => {
            this.validatePassword(passwordInput, 'password-error', false);
        });
        
        passwordInput?.addEventListener('input', () => {
            this.clearError(passwordInput, 'password-error');
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit(form);
        });
    }

    setupRegisterValidation(form) {
        const nameInput = form.querySelector('#register-name');
        const emailInput = form.querySelector('#register-email');
        const passwordInput = form.querySelector('#register-password');
        const confirmPasswordInput = form.querySelector('#register-confirm-password');
        
        nameInput?.addEventListener('blur', () => {
            this.validateName(nameInput, 'name-error');
        });
        
        emailInput?.addEventListener('blur', () => {
            this.validateEmail(emailInput, 'register-email-error');
        });
        
        passwordInput?.addEventListener('input', () => {
            this.validatePassword(passwordInput, 'register-password-error', true);
            this.validatePasswordMatch(passwordInput, confirmPasswordInput, 'confirm-password-error');
        });
        
        confirmPasswordInput?.addEventListener('input', () => {
            this.validatePasswordMatch(passwordInput, confirmPasswordInput, 'confirm-password-error');
        });
        
        // Limpar erros ao digitar
        [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            input?.addEventListener('input', () => {
                if (input.id.includes('name')) this.clearError(input, 'name-error');
                if (input.id.includes('email')) this.clearError(input, 'register-email-error');
                if (input.id.includes('password') && !input.id.includes('confirm')) {
                    this.clearError(input, 'register-password-error');
                }
                if (input.id.includes('confirm')) this.clearError(input, 'confirm-password-error');
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegisterSubmit(form);
        });
    }

    // Validações específicas
    validateEmail(input, errorId) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(input, errorId, 'Email é obrigatório');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(input, errorId, 'Email inválido');
            return false;
        }
        
        this.showSuccess(input);
        return true;
    }

    validatePassword(input, errorId, showStrength = false) {
        const password = input.value;
        
        if (!password) {
            this.showError(input, errorId, 'Senha é obrigatória');
            return false;
        }
        
        if (password.length < 6) {
            this.showError(input, errorId, 'Senha deve ter pelo menos 6 caracteres');
            return false;
        }
        
        if (showStrength) {
            this.showPasswordStrength(password, input);
        }
        
        this.showSuccess(input);
        return true;
    }

    validateName(input, errorId) {
        const name = input.value.trim();
        
        if (!name) {
            this.showError(input, errorId, 'Nome é obrigatório');
            return false;
        }
        
        if (name.length < 2) {
            this.showError(input, errorId, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        this.showSuccess(input);
        return true;
    }

    validatePasswordMatch(passwordInput, confirmInput, errorId) {
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        
        if (!confirmPassword) {
            this.showError(confirmInput, errorId, 'Confirmação de senha é obrigatória');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showError(confirmInput, errorId, 'Senhas não coincidem');
            return false;
        }
        
        this.showSuccess(confirmInput);
        return true;
    }

    // Mostrar força da senha
    showPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        // A implementação visual da força pode ser adicionada aqui
        return strength;
    }

    // Utilitários de validação
    showError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);
        const formGroup = input.closest('.form-group');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        if (formGroup) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
        }
        
        input.setAttribute('aria-invalid', 'true');
    }

    showSuccess(input) {
        const formGroup = input.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.add('success');
            formGroup.classList.remove('error');
        }
        
        input.setAttribute('aria-invalid', 'false');
    }

    clearError(input, errorId) {
        const errorElement = document.getElementById(errorId);
        const formGroup = input.closest('.form-group');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        
        if (formGroup) {
            formGroup.classList.remove('error');
        }
        
        input.removeAttribute('aria-invalid');
    }

    // Estados de loading
    setupLoadingStates() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        
        this.buttons = { loginBtn, registerBtn };
    }

    setLoadingState(button, isLoading) {
        if (!button) return;
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Toggles mobile
    setupMobileToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-form');
        const slider = document.querySelector('.slider-container');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                
                if (target === 'register') {
                    slider?.classList.add('right-panel-active');
                } else {
                    slider?.classList.remove('right-panel-active');
                }
                
                // Focar no primeiro campo do formulário ativo
                setTimeout(() => {
                    const activeForm = target === 'register' ? 
                        document.querySelector('#register-form') : 
                        document.querySelector('#login-form');
                    
                    const firstInput = activeForm?.querySelector('input');
                    firstInput?.focus();
                }, 300);
            });
        });
    }

    // Navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC para limpar erros
            if (e.key === 'Escape') {
                this.clearAllErrors();
            }
            
            // Enter em inputs para ir para o próximo
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                const form = e.target.closest('form');
                const inputs = Array.from(form.querySelectorAll('input'));
                const currentIndex = inputs.indexOf(e.target);
                
                if (currentIndex < inputs.length - 1) {
                    e.preventDefault();
                    inputs[currentIndex + 1].focus();
                }
            }
        });
    }

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    }

    // Handlers de submit
    async handleLoginSubmit(form) {
        const emailInput = form.querySelector('#login-email');
        const passwordInput = form.querySelector('#login-password');
        const button = document.getElementById('login-btn');
        
        // Validar campos
        const isEmailValid = this.validateEmail(emailInput, 'email-error');
        const isPasswordValid = this.validatePassword(passwordInput, 'password-error');
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        // Mostrar loading
        this.setLoadingState(button, true);
        
        try {
            // Aqui conecta com a lógica de login existente
            const event = new CustomEvent('modernLogin', {
                detail: {
                    email: emailInput.value,
                    password: passwordInput.value,
                    remember: form.querySelector('#remember-me')?.checked
                }
            });
            
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('Erro no login:', error);
            this.showError(emailInput, 'email-error', 'Erro ao fazer login. Tente novamente.');
        } finally {
            this.setLoadingState(button, false);
        }
    }

    async handleRegisterSubmit(form) {
        const nameInput = form.querySelector('#register-name');
        const emailInput = form.querySelector('#register-email');
        const passwordInput = form.querySelector('#register-password');
        const confirmPasswordInput = form.querySelector('#register-confirm-password');
        const button = document.getElementById('register-btn');
        
        // Validar todos os campos
        const isNameValid = this.validateName(nameInput, 'name-error');
        const isEmailValid = this.validateEmail(emailInput, 'register-email-error');
        const isPasswordValid = this.validatePassword(passwordInput, 'register-password-error', true);
        const isConfirmValid = this.validatePasswordMatch(passwordInput, confirmPasswordInput, 'confirm-password-error');
        
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            return;
        }
        
        // Mostrar loading
        this.setLoadingState(button, true);
        
        try {
            // Aqui conecta com a lógica de registro existente
            const event = new CustomEvent('modernRegister', {
                detail: {
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value
                }
            });
            
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('Erro no registro:', error);
            this.showError(emailInput, 'register-email-error', 'Erro ao criar conta. Tente novamente.');
        } finally {
            this.setLoadingState(button, false);
        }
    }

    // Método público para outras partes da aplicação
    static getInstance() {
        if (!ModernLoginManager.instance) {
            ModernLoginManager.instance = new ModernLoginManager();
        }
        return ModernLoginManager.instance;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que todos os elementos estejam disponíveis
    setTimeout(() => {
        ModernLoginManager.getInstance();
        
        // Adicionar classe para indicar que as funcionalidades modernas estão ativas
        document.body.classList.add('modern-login-active');
    }, 100);
});

// Exportar para uso em outros módulos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernLoginManager;
} 