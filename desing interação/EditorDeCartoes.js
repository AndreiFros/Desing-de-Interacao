document.addEventListener("DOMContentLoaded", () => {
	// Busca o formulário principal do editor.
	const form = document.getElementById("editor-form");
	// Se o formulário não existir nesta página, o script é encerrado.
	if (!form) {
		return;
	}

	// Reúne referências dos campos de entrada e dos elementos da pré-visualização.
	const elements = {
		occasion: document.getElementById("occasion"),
		titleText: document.getElementById("titleText"),
		messageText: document.getElementById("messageText"),
		signatureText: document.getElementById("signatureText"),
		bgColor: document.getElementById("bgColor"),
		accentColor: document.getElementById("accentColor"),
		cardPreview: document.getElementById("cardPreview"),
		cardOccasion: document.getElementById("cardOccasion"),
		cardTitle: document.getElementById("cardTitle"),
		cardMessage: document.getElementById("cardMessage"),
		cardSignature: document.getElementById("cardSignature")
	};

	// Remove espaços extras e aplica um texto padrão quando o campo estiver vazio.
	const sanitizeText = (value, fallback) => value.trim() || fallback;

	// Atualiza o cartão de pré-visualização com os valores atuais do formulário.
	const updateCard = () => {
		// Define medidas fixas do cartão simplificado.
		elements.cardPreview.style.width = "360px";
		elements.cardPreview.style.minHeight = "260px";
		// Aplica as cores escolhidas no formulário.
		elements.cardPreview.style.backgroundColor = elements.bgColor.value;
		elements.cardPreview.style.borderColor = elements.accentColor.value;
		elements.cardPreview.style.color = "#222222";

		// Atualiza os textos do cartão com fallback para evitar conteúdo vazio.
		elements.cardOccasion.textContent = sanitizeText(elements.occasion.value, "Ocasião");
		elements.cardTitle.textContent = sanitizeText(elements.titleText.value, "Seu título");
		elements.cardTitle.style.color = elements.accentColor.value;
		elements.cardMessage.textContent = sanitizeText(elements.messageText.value, "Sua mensagem aparecerá aqui.");
		elements.cardSignature.textContent = sanitizeText(elements.signatureText.value, "Assinatura");
	};

	// Sempre que houver alteração no formulário, o cartão é renderizado novamente.
	form.addEventListener("input", updateCard);
	// Renderização inicial quando a página termina de carregar.
	updateCard();
});
