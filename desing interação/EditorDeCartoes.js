document.addEventListener("DOMContentLoaded", () => {
	// Garante que o script rode apenas na página que possui o formulário do editor.
	const form = document.getElementById("editor-form");
	if (!form) {
		return;
	}

	// Centraliza todas as referências de elementos para evitar buscas repetidas no DOM.
	const elements = {
		occasion: document.getElementById("occasion"),
		titleText: document.getElementById("titleText"),
		messageText: document.getElementById("messageText"),
		signatureText: document.getElementById("signatureText"),
		bgColor: document.getElementById("bgColor"),
		textColor: document.getElementById("textColor"),
		accentColor: document.getElementById("accentColor"),
		fontFamily: document.getElementById("fontFamily"),
		cardWidth: document.getElementById("cardWidth"),
		cardHeight: document.getElementById("cardHeight"),
		imageUrl: document.getElementById("imageUrl"),
		imageUpload: document.getElementById("imageUpload"),
		showBorder: document.getElementById("showBorder"),
		borderStyle: document.getElementById("borderStyle"),
		borderSize: document.getElementById("borderSize"),
		widthValue: document.getElementById("widthValue"),
		heightValue: document.getElementById("heightValue"),
		borderValue: document.getElementById("borderValue"),
		decorText: document.getElementById("decorText"),
		decorBg: document.getElementById("decorBg"),
		decorColor: document.getElementById("decorColor"),
		decorSize: document.getElementById("decorSize"),
		addDecor: document.getElementById("addDecor"),
		decorStatus: document.getElementById("decorStatus"),
		cardPreview: document.getElementById("cardPreview"),
		cardOccasion: document.getElementById("cardOccasion"),
		cardTitle: document.getElementById("cardTitle"),
		cardMessage: document.getElementById("cardMessage"),
		cardSignature: document.getElementById("cardSignature"),
		cardImage: document.getElementById("cardImage"),
		decorContainer: document.getElementById("decorContainer")
	};

	// Limite para impedir excesso de elementos decorativos no cartão.
	const maxDecorItems = 5;
	const decorItems = [];

	// Remove espaços desnecessários e aplica texto padrão quando o campo estiver vazio.
	const sanitizeText = (value, fallback) => {
		const normalized = value.trim();
		return normalized.length > 0 ? normalized : fallback;
	};

	// Ativa/desativa os campos de borda de acordo com o checkbox.
	const updateBorderControls = () => {
		const isChecked = elements.showBorder.checked;
		elements.borderStyle.disabled = !isChecked;
		elements.borderSize.disabled = !isChecked;
	};

	// Mostra ou oculta a imagem de pré-visualização do cartão.
	const applyImage = (source) => {
		if (!source) {
			elements.cardImage.hidden = true;
			elements.cardImage.removeAttribute("src");
			return;
		}

		elements.cardImage.src = source;
		elements.cardImage.hidden = false;
	};

	// Aplica todos os valores do formulário no cartão em tempo real.
	const updateCard = () => {
		const width = Number(elements.cardWidth.value);
		const height = Number(elements.cardHeight.value);
		const borderWidth = Number(elements.borderSize.value);

		elements.widthValue.textContent = String(width);
		elements.heightValue.textContent = String(height);
		elements.borderValue.textContent = String(borderWidth);

		elements.cardPreview.style.width = `${width}px`;
		elements.cardPreview.style.minHeight = `${height}px`;
		elements.cardPreview.style.backgroundColor = elements.bgColor.value;
		elements.cardPreview.style.color = elements.textColor.value;
		elements.cardPreview.style.fontFamily = elements.fontFamily.value;

		if (elements.showBorder.checked) {
			elements.cardPreview.style.borderStyle = elements.borderStyle.value;
			elements.cardPreview.style.borderWidth = `${borderWidth}px`;
			elements.cardPreview.style.borderColor = elements.accentColor.value;
		} else {
			elements.cardPreview.style.border = "none";
		}

		elements.cardOccasion.textContent = sanitizeText(elements.occasion.value, "Ocasião");
		elements.cardTitle.textContent = sanitizeText(elements.titleText.value, "Seu título");
		elements.cardTitle.style.color = elements.accentColor.value;
		elements.cardMessage.textContent = sanitizeText(elements.messageText.value, "Sua mensagem aparecerá aqui.");
		elements.cardSignature.textContent = sanitizeText(elements.signatureText.value, "Assinatura");
	};

	// Atualiza contador visual e desativa botão quando atingir o limite.
	const updateDecorStatus = () => {
		elements.decorStatus.textContent = `${decorItems.length} de ${maxDecorItems} elementos adicionados.`;
		elements.addDecor.disabled = decorItems.length >= maxDecorItems;
	};

	// Renderiza os itens decorativos adicionados pelo usuário.
	const renderDecorItems = () => {
		elements.decorContainer.innerHTML = "";

		decorItems.forEach((item) => {
			const decor = document.createElement("span");
			decor.className = "decor-item";
			decor.textContent = item.text;
			decor.style.backgroundColor = item.bg;
			decor.style.color = item.color;
			decor.style.fontSize = `${item.size}px`;
			elements.decorContainer.appendChild(decor);
		});

		updateDecorStatus();
	};

	// Trata upload de arquivo de imagem com validação de formato e tamanho.
	const onImageFileChange = () => {
		const file = elements.imageUpload.files && elements.imageUpload.files[0];
		if (!file) {
			return;
		}

		const validTypes = ["image/png", "image/jpeg", "image/webp"];
		const maxBytes = 2 * 1024 * 1024;

		if (!validTypes.includes(file.type) || file.size > maxBytes) {
			elements.imageUpload.value = "";
			return;
		}

		const reader = new FileReader();
		reader.addEventListener("load", () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			applyImage(result);
			elements.imageUrl.value = "";
		});
		reader.readAsDataURL(file);
	};

	// Usa imagem por URL e limpa upload para evitar duas fontes simultâneas.
	const onImageUrlInput = () => {
		const value = elements.imageUrl.value.trim();
		if (value === "") {
			if (!elements.imageUpload.value) {
				applyImage("");
			}
			return;
		}

		applyImage(value);
		elements.imageUpload.value = "";
	};

	// Cria um novo elemento decorativo com limites de quantidade e tamanho.
	const addDecorItem = () => {
		if (decorItems.length >= maxDecorItems) {
			return;
		}

		const text = elements.decorText.value.trim();
		const size = Number(elements.decorSize.value);
		if (text.length === 0 || Number.isNaN(size)) {
			return;
		}

		const safeSize = Math.min(24, Math.max(10, size));
		decorItems.push({
			text,
			bg: elements.decorBg.value,
			color: elements.decorColor.value,
			size: safeSize
		});

		elements.decorText.value = "";
		renderDecorItems();
	};

	// Atualiza automaticamente o cartão quando qualquer campo do formulário mudar.
	form.addEventListener("input", updateCard);
	elements.showBorder.addEventListener("change", () => {
		updateBorderControls();
		updateCard();
	});
	elements.imageUrl.addEventListener("input", onImageUrlInput);
	elements.imageUpload.addEventListener("change", onImageFileChange);
	elements.addDecor.addEventListener("click", addDecorItem);

	// Estado inicial da tela ao carregar a página.
	updateBorderControls();
	updateCard();
	renderDecorItems();
});
