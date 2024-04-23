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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	}
	
	maskPhone = (phone) => {
	let phoneValue = phone.value.replace(/[^0-9]/g, '');
	
	if (phoneValue >= 11) phoneValue = phoneValue.slice(0, 11);
	
	let phoneMask = '';
	if (phoneValue.length === 11) {
	
	
	
	
	} else if (phoneValue.length === 10) {
	
	
	
	
	}
	phone.value = phoneMask;
	};
	
	validadeFieldRequired = () => {
	//console.log(pwrcrmform);
	};
	
	saveForm = async function () {
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	cleanForm(){
	
	
	
	
	
	
	
	async fetchStates() {
	
	
	
	
	
	
	}
	
	async fetchCities(stateId) {
	this.fieldCity.innerHTML = '<option value="0">Buscando cidades..</option>';
	const response = await this.fetchApi(
	
	
	
	
	
	
	);
	if (response) this.constructSelect(this.fieldCity, response);
	}
	
	// funcÃµes globais
	async fetchApi(url, option) {
	return await fetch(url, option)
	
	
	}
	
	constructSelect(select, arr) {
	select.innerHTML = '<option val="0">Selecione</option>';
	
	arr.map((a) => {
	
	
	
	
	
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
