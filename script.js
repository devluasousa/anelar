class POWERCRM {
    pwrst = 'https://app.powercrm.com.br';
    pwrcrmform;
    noPlanLink = 'https://app.powercrm.com.br/noPlan';
    receivedQuotationLink = 'https://app.powercrm.com.br/receivedQuotation';

    //fields
    fieldName;
    fieldPhone;
    fieldPlate;
    fieldCity;
    fieldState;

    constructor(form) {
        this.pwrcrmform = form;
        this.fieldName = this.pwrcrmform.elements['pwrClntNm'];
        this.fieldPhone = this.pwrcrmform.elements['pwrCltPhn'];
        this.fieldPlate = this.pwrcrmform.elements['pwrVhclPlt'];
        this.fieldCity = this.pwrcrmform.elements['pwrCt'];
        this.fieldState = this.pwrcrmform.elements['pwrStt'];

        if (this.fieldPhone) {
            this.fieldPhone.addEventListener('blur', () => this.maskPhone(this.fieldPhone));
        }

        if (this.fieldState) {
            this.fetchStates();
            this.fieldState.addEventListener('change', () => {
                let stateId = this.fieldState.value;
                if (stateId && stateId > 0) this.fetchCities(stateId);
            });
        }

        this.pwrcrmform.addEventListener('submit', event => {
            event.preventDefault();
            this.saveForm();
        });

        this.loadLgpdTermsLink();
    }

    maskPhone(phone) {
        let phoneValue = phone.value.replace(/[^0-9]/g, '');
        if (phoneValue.length > 11) phoneValue = phoneValue.slice(0, 11);
        let phoneMask = '';
        if (phoneValue.length === 11) {
            phoneMask = `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2, 7)}-${phoneValue.slice(7)}`;
        } else if (phoneValue.length === 10) {
            phoneMask = `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2, 6)}-${phoneValue.slice(6)}`;
        }
        phone.value = phoneMask;
    }

    saveForm = async function () {
        // Verifica se os campos obrigatórios estão preenchidos
        const requiredFields = [this.fieldName, this.fieldPhone, this.fieldPlate];
        for (let field of requiredFields) {
            if (!field || !field.value.trim()) {
                alert('Todos os campos são obrigatórios. Por favor, preencha-os antes de submeter.');
                field.focus();
                return;
            }
        }

        if (this.fieldState.value === "0") {
            alert('Por favor, selecione um estado da lista.');
            this.fieldState.focus();
            return;
        }

        if (this.fieldCity.value === "0") {
            alert('Por favor, selecione uma cidade da lista.');
            this.fieldCity.focus();
            return;
        }

        let pwrcrmdata = {
            companyHash: this.getValue('#pwrCmpnHsh'),
            formCode: this.getValue('#pwrFrmCode'),
            leadSource: this.getValue('#pwrLdSrc'),
            pipelineColumn: this.getValue('#pwrPplnClmn'),
            companyUserCode: this.getValue('#pwrCnsltnt') || this.getParameter('id'),
            affiliateCode: this.getValue('#pwrAfflt') || this.getParameter('in'),
            clientName: this.fieldName.value,
            clientPhone: this.fieldPhone.value,
            vehiclePlate: this.fieldPlate.value,
            clientCity: this.fieldCity.value,
            clientState: this.fieldState.value
        };

        const response = await this.fetchApi(`${this.pwrst}/svQttnDynmcFrm`, {
            method: 'POST',
            body: JSON.stringify(pwrcrmdata),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.success) {
            window.location.href = 'https://anelarmutual.com.br/pagina-de-obrigado/';
        } else {
            alert('Ocorreu um erro ao processar a requisição. Por favor, tente novamente mais tarde.');
        }
    };

    fetchStates() {
        this.fieldState.innerHTML = '<option value="0">Buscando estados...</option>';
        this.fetchApi(`https://utilities.powercrm.com.br/state/stt`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(data => this.constructSelect(this.fieldState, data));
    }

    fetchCities(stateId) {
        this.fieldCity.innerHTML = '<option value="0">Buscando cidades...</option>';
        this.fetchApi(`https://utilities.powercrm.com.br/city/ct?${new URLSearchParams({ st: stateId })}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(data => this.constructSelect(this.fieldCity, data));
    }

    fetchApi(url, option) {
        return fetch(url, option)
            .then(response => response.json())
            .catch(err => console.error(err.message));
    }

    constructSelect(select, arr) {
        select.innerHTML = '<option value="0">Selecione</option>'; // Reset and show initial option
        arr.forEach(a => {
            let option = document.createElement('option');
            option.value = a.id;
            option.textContent = a.text;
            select.appendChild(option);
        });
    }

    loadLgpdTermsLink() {
        if (!this.pwrcrmform.querySelector('.terms-text')) {
            let textTerms = document.createElement('p');
            textTerms.className = 'terms-text';
            textTerms.innerHTML = 'Ao preencher o formulário, concordo em receber comunicações e estou de acordo com os <a target="_blank" href="https://site.powercrm.com.br/termos-e-condicoes/">termos de uso</a>.';
            this.pwrcrmform.append(textTerms);
        }
    }

    getParameter(parameter) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(parameter);
    }

    getValue(selector) {
        const element = this.pwrcrmform.querySelector(selector);
        return element ? element.value : '';
    }
}

document.querySelectorAll("#pwrcrmform").forEach(form => new POWERCRM(form));

function nextStep(stepNumber) {
    const currentStep = document.getElementById(`step${stepNumber}`);
    if (!currentStep) {
        console.error("Erro: Etapa atual não encontrada.");
        return;
    }

    const fields = currentStep.querySelectorAll('input[required], select[required]');
    const emptyFields = Array.from(fields).filter(field => !field.value.trim());
    
    if (emptyFields.length > 0) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        emptyFields[0].focus(); // Foca no primeiro campo vazio
        console.log("Campos vazios encontrados:", emptyFields);
        return;
    }

    console.log("Todos os campos da etapa", stepNumber, "estão preenchidos.");

    // Esconde a etapa atual e mostra a próxima
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => step.style.display = 'none');

    const nextStepElement = document.getElementById(`step${parseInt(stepNumber) + 1}`);
    if (nextStepElement) {
        nextStepElement.style.display = 'block';
        console.log("Movendo para a etapa", parseInt(stepNumber) + 1);
    } else {
        console.error("Erro: Próxima etapa não encontrada.");
    }
}

function prevStep(stepNumber) {
    // Esconde todas as etapas
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => {
        step.style.display = 'none';
    });

    // Mostra a etapa anterior
    const prevStep = document.getElementById(`step${stepNumber}`);
    if (prevStep) {
        prevStep.style.display = 'block';
    }
}

var forms = document.querySelectorAll("#pwrcrmform");
for (let form of forms) new POWERCRM(form);
