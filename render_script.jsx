(function () {

    function trimTexto(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    function enviarVideos() {
        try {
            if (!BridgeTalk.isRunning("ame")) {
                alert("Abra o Adobe Media Encoder antes de executar!");
                return;
            }

            var compOriginal = app.project.activeItem;
            if (!compOriginal || !(compOriginal instanceof CompItem)) {
                alert("Selecione uma composição válida!");
                return;
            }

            var jsonFile = new File(Folder.current.fsName + "/automation_data.json");
            if (!jsonFile.exists) {
                alert("Arquivo JSON não encontrado!");
                return;
            }

            jsonFile.open("r");
            var jsonData = jsonFile.read();
            jsonFile.close();

            if (!jsonData) {
                alert("Erro: Arquivo JSON está vazio ou não foi lido corretamente!");
                return;
            }

            var videos;
            try {
                videos = eval("(" + jsonData + ")"); // Mantendo eval() conforme seu script original
            } catch (e) {
                alert("Erro ao interpretar o JSON:\n" + e.message);
                return;
            }

            var enviados = 0;

            for (var i = 0; i < videos.length; i++) {
                try {
                    if (!videos[i] || !videos[i].texto) {
                        alert("Item " + (i + 1) + ": Texto vazio ou inválido");
                        continue;
                    }

                    var textoLimpo = trimTexto(videos[i].texto);

                    // Duplica a composição original
                    var compDuplicada = compOriginal.duplicate();

                    // Encontra camada de texto dentro da duplicata
                    var camadaTexto = null;
                    for (var j = 1; j <= compDuplicada.numLayers; j++) {
                        var layer = compDuplicada.layer(j);
                        if (layer.property("Source Text") !== null) {
                            camadaTexto = layer;
                            break;
                        }
                    }

                    if (!camadaTexto) {
                        alert("Camada de texto não encontrada na composição duplicada!");
                        continue;
                    }

                    // Altera o texto da camada na composição duplicada
                    var textProp = camadaTexto.property("Source Text");
                    var textDoc = textProp.value;
                    textDoc.text = textoLimpo;
                    textProp.setValue(textDoc);

                    var outputFile = new File(videos[i].saida);
                    if (!outputFile.parent.exists) outputFile.parent.create();

                    // Envia para renderização no Media Encoder
                    var rqItem = app.project.renderQueue.items.add(compDuplicada);
                    var om = rqItem.outputModule(1);
                    om.file = outputFile;

                    app.project.renderQueue.queueInAME(true);
                    $.sleep(1000); // Espera curta para garantir o envio correto

                    enviados++;

                } catch (e) {
                    alert("Erro no item " + (i + 1) + ":\n" + e.message);
                }
            }

            alert("Processo concluído!\n" + enviados + " vídeos enviados para o Media Encoder.");

        } catch (e) {
            alert("Erro fatal:\n" + e.message);
        }
    }

    enviarVideos();

})();
