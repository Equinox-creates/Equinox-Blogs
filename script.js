document.addEventListener("DOMContentLoaded", () => {
    const elementsPanel = document.querySelector(".elements-panel");
    const canvas = document.querySelector(".canvas");

    elementsPanel.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const elementType = event.target.getAttribute("data-element");
            addElementToCanvas(elementType);
        }
    });

    function addElementToCanvas(type) {
        let newElement;

        switch (type) {
            case "text":
                newElement = document.createElement("div");
                newElement.contentEditable = true;
                newElement.textContent = "Editable Text";
                newElement.style.border = "1px solid #ccc";
                newElement.style.padding = "10px";
                newElement.style.margin = "10px 0";
                break;

            case "image":
                newElement = document.createElement("input");
                newElement.type = "file";
                newElement.accept = "image/*";
                break;

            case "card":
                newElement = document.createElement("div");
                newElement.style.border = "1px solid #ccc";
                newElement.style.padding = "10px";
                newElement.style.margin = "10px 0";
                newElement.innerHTML = `<h3>Card Title</h3><p>Card content...</p>`;
                break;

            case "video":
                newElement = document.createElement("input");
                newElement.type = "file";
                newElement.accept = "video/*";
                break;

            default:
                console.error("Unknown element type: " + type);
                return;
        }

        canvas.appendChild(newElement);
    }
});