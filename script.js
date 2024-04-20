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
		  //fields
		  this.fieldName = this.pwrcrmform.elements['pwrClntNm'];
		  this.fieldPhone = this.pwrcrmform.elements['pwrCltPhn'];
		  this.fieldPlate = this.pwrcrmform.elements['pwrVhclPlt'];  
		  this.fieldCity = this.pwrcrmform.elements['pwrCt'];
		  this.fieldState = this.pwrcrmform.elements['pwrStt'];
		  
  
		  // event field Phone
		  if (this.fieldPhone) {
			this.fieldPhone.addEventListener('blur', (event) => {
				this.maskPhone(this.fieldPhone);
			});
		  }
  
		  // event field States
		  if (this.fieldState) {
			this.fetchStates();
			this.fieldState.addEventListener('change', (event) => {
				let stateId = this.fieldState.value;
			  	if (stateId && stateId > 0) this.fetchCities(stateId);
			});
		  }

  
		  // event submit
		  this.pwrcrmform.addEventListener('submit', (event) => {
			event.preventDefault();
			this.saveForm();
		  });
  
		  this.loadLgpdTermsLink();
  
  
	}
  
	maskPhone = (phone) => {
	  let phoneValue = phone.value.replace(/[^0-9]/g, '');
  
	  if (phoneValue >= 11) phoneValue = phoneValue.slice(0, 11);
  
	  let phoneMask = '';
	  if (phoneValue.length === 11) {
		const p1 = phoneValue.slice(0, 2);
		const p2 = phoneValue.slice(2, 7);
		const p3 = phoneValue.slice(7, 11);
		phoneMask = `(${p1}) ${p2}-${p3}`;
	  } else if (phoneValue.length === 10) {
		const p1 = phoneValue.slice(0, 2);
		const p2 = phoneValue.slice(2, 6);
		const p3 = phoneValue.slice(6, 10);
		phoneMask = `(${p1}) ${p2}-${p3}`;
	  }
	  phone.value = phoneMask;
	};
  
	validadeFieldRequired = () => {
	  //console.log(pwrcrmform);
	};
  
	saveForm = async function () {
		let pwrcrmdata = {};
	  
		if (
		  !this.pwrcrmform.elements['pwrCmpnHsh'] ||
		  !this.pwrcrmform.elements['pwrFrmCode']
		) {
		  alert('O formato do formulário não está correto!');
		  return false;
		}
	  
		this.validadeFieldRequired();
	  
		//fields hides
		if (this.getValue('#pwrCmpnHsh'))
		  pwrcrmdata.companyHash = this.getValue('#pwrCmpnHsh');
		if (this.getValue('#pwrFrmCode'))
		  pwrcrmdata.formCode = this.getValue('#pwrFrmCode');
		if (this.getValue('#pwrLdSrc'))
		  pwrcrmdata.leadSource = this.getValue('#pwrLdSrc');
		if (this.getValue('#pwrPplnClmn'))
		  pwrcrmdata.pipelineColumn = this.getValue('#pwrPplnClmn');
		if (this.getValue('#pwrCnsltnt'))
		  pwrcrmdata.companyUserCode = this.getValue('#pwrCnsltnt');
		if (this.getValue('#pwrAfflt'))
		  pwrcrmdata.affiliateCode = this.getValue('#pwrAfflt');
	  
		//client
		if (this.fieldName) pwrcrmdata.clientName = this.fieldName.value;
	  
		if (this.fieldPhone) pwrcrmdata.clientPhone = this.fieldPhone.value;
	  
		if (this.fieldPlate) pwrcrmdata.vehiclePlate = this.fieldPlate.value;
	  
		if (this.fieldCity) pwrcrmdata.clientCity = this.fieldCity.value;
	  
		if (this.fieldState) pwrcrmdata.clientState = this.fieldState.value;
	  
		try {
		  // get consultant value by url
		  if (!pwrcrmdata.companyUserCode)
			pwrcrmdata.companyUserCode = this.getParameter('id');
	  
		  if (!pwrcrmdata.affiliateCode)
			pwrcrmdata.affiliateCode = this.getParameter('in');
		} catch (e) {}
	  
		const response = await this.fetchApi(`${this.pwrst}/svQttnDynmcFrm`, {
		  method: 'POST',
		  body: JSON.stringify(pwrcrmdata),
		  headers: { 'Content-Type': 'application/json' },
		});
	  
		if (response.success) {
			this.showSuccessMessage(); // Mostra a mensagem de sucesso
			this.cleanForm(); // Limpa o formulário
			this.showStep(1); // Volta para a etapa 1
		  } else {
			alert('Ocorreu um erro ao processar a requisição. Por favor, tente novamente mais tarde.');
		  }
		};
	  
	  
	showSuccessMessage() {
		// Cria um elemento para a mensagem de sucesso
		const successMessage = document.createElement('div');
		successMessage.textContent = 'Formulário enviado com sucesso';
		successMessage.style.color = 'green';
		successMessage.style.marginTop = '10px';
		// Adiciona o elemento à página, por exemplo, ao final do formulário
		this.pwrcrmform.appendChild(successMessage);
	
		// Adiciona evento de clique para voltar para a etapa 1 ao clicar em "OK"
		successMessage.addEventListener('click', () => {
			successMessage.style.display = 'none'; // Oculta a mensagem de sucesso
		});
		}
	
		showStep(stepNumber) {
		const steps = document.querySelectorAll('.form-step');
		steps.forEach(step => {
			step.style.display = 'none';
		});
	
		const currentStep = document.getElementById(`step${stepNumber}`);
		if (currentStep) {
			currentStep.style.display = 'block';
		}
		}
	
  
	cleanForm(){
		try {
			if(this.fieldName) this.fieldName.value = '';
			if(this.fieldPhone) this.fieldPhone.value = '';
  
			if(this.fieldPlate) this.fieldPlate.value = '';

			if(this.fieldCity) this.fieldCity.value = '0';
			if(this.fieldState) this.fieldState.value = '0';

	   		}catch (e) {}
		}
  
	async fetchStates() {
		this.fieldState.innerHTML = '<option value="0">Buscando estados..</option>';
		const response = await this.fetchApi(`https://utilities.powercrm.com.br/state/stt`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
		if (response) this.constructSelect(this.fieldState, response);
	}
  
	async fetchCities(stateId) {
	  this.fieldCity.innerHTML = '<option value="0">Buscando cidades..</option>';
	  const response = await this.fetchApi(
		`https://utilities.powercrm.com.br/city/ct?${new URLSearchParams({ st: stateId })}`,
		{
		  method: 'GET',
		  // body: JSON.stringify({st: stateId}),
		  headers: { 'Content-Type': 'application/json' },
		},
	  );
	  if (response) this.constructSelect(this.fieldCity, response);
	}
  
	// funcÃµes globais
	async fetchApi(url, option) {
	  return await fetch(url, option)
		.catch((er) => console.error(er.message))
		.then((response) => response.json());
	}
  
	constructSelect(select, arr) {
	  select.innerHTML = '<option val="0">Selecione</option>';
  
	  arr.map((a) => {
		let option = document.createElement('option');
		option.value = a.id;
		option.innerHTML = a.text;
  
		select.appendChild(option);
	  });
	}
  
	loadLgpdTermsLink(){
	  let textTerms = document.createElement('p');
	  textTerms.style.marginTop = '10px';
	  textTerms.style.width = '100%';
	  textTerms.style.display = 'block';
	  textTerms.style.fontSize = '12px';
	  textTerms.innerHTML = 'Ao preencher o formulário, concordo em receber comunicações e estou de acordo com os <a target="_blank" href="https://site.powercrm.com.br/termos-e-condicoes/">termos de uso</a>.'
  
	  this.pwrcrmform.append(textTerms);
	}
  
	getParameter(parameter) {
	  const queryString = window.location.search;
	  const urlParams = new URLSearchParams(queryString);
	  return urlParams.get(parameter);
	}
  
	getValue = (field) =>
	  this.pwrcrmform.querySelector(field) && this.pwrcrmform.querySelector(field).value;
  }
  
  function nextStep(stepNumber) {
	const steps = document.querySelectorAll('.form-step');
	steps.forEach(step => {
	  step.style.display = 'none';
	});
  
	const currentStep = document.getElementById(`step${stepNumber}`);
	if (currentStep) {
	  currentStep.style.display = 'block';
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
