# inventario

Programma funziona grazie a una docker.

Per far partire il programma: 
	1) aprire un terminale: andare simbolo di windows in basso a sinistra e scrivere: 
			cmd.exe 
	   schiacciare sull'icona e avviare il prompt dei comandi
	   
	2) (non necessario in quanto già presente) installare docker.
		Verificabile con scrivendo sul prompt precedentemente aperto: 
			docker --version
		Se non va in errore prima di scaricare docker digitare: 
			net start com.docker.service
		(per questa operazione server un promptcome admin: passaggio 1, schiacciare con tasto destro su icona e selezionare "esegui come amministratore")
	
	3) collegare la repository di github dove è presente il docker registry con il server node (cioè dove è il programma). Scrivere sul prompt:
			export CR_PAT=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
			echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
	
	4) a questo punto basterà eseguire il seguente comando per avviare il programma:
			docker compose up
	
	5) è possibile visualizzare il sito aprendo un browser e inserndo come url il seguente indirizzo:
			http://localhost:3000

Per eventuali dubbi far riferimento a https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
In caso sia necessario far una pull del dockerfile: 
	docker pull ghcr.io/chiesa/node_inventario:1
