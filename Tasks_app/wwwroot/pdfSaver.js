window.PdfSaver = {

    async savePdf(fileName, base64Data) {

        const isDirPickerSupported =
            "showDirectoryPicker" in window &&
            typeof window.showDirectoryPicker === "function";

        const isMobile =
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        // fallback для мобилок и неподдерживаемых браузеров
        if (!isDirPickerSupported || isMobile) {
            console.warn("DirectoryPicker недоступен — стандартное скачивание.");

            const link = document.createElement("a");
            link.href = "data:application/pdf;base64," + base64Data;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        try {
            // диалог выбора папки
            const dirHandle = await window.showDirectoryPicker();

            // тест: можно ли писать в эту папку?
            const perm = await dirHandle.queryPermission({ mode: "readwrite" });

            if (perm === "denied") {
                alert("Эта папка защищена системой. Выбери любую другую.");
                return;
            }

            if (perm !== "granted") {
                const req = await dirHandle.requestPermission({ mode: "readwrite" });
                if (req !== "granted") {
                    alert("Нет доступа к папке. Выбери другую.");
                    return;
                }
            }

            // создаём файл
            const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();

            // конвертация base64 → Uint8Array
            const raw = atob(base64Data);
            const buffer = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) buffer[i] = raw.charCodeAt(i);

            await writable.write(buffer);
            await writable.close();

            alert("PDF успешно сохранён!");

        } catch (err) {
            console.error("Ошибка:", err);

            if (err.name === "NotAllowedError") {
                alert("Эта папка недоступна для записи. Выберите другую.");
            } else {
                alert("Не удалось сохранить файл: " + err.message);
            }
        }
    }
};
