class GUI{
	constructor(){
		this.input = document.getElementById('fileInput');
		this.files = null;
		this.listeners();
	}

	listeners(){
		this.input.addEventListener('change',this.fileHandler);
		

	}

	fileHandler(e){
		this.files = e.target.files[0];
		
	}



}