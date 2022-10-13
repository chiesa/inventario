# inventario

Programma funziona grazie a una docker.

Per far partire il programma: <br />

1) <b> aprire un terminale </b> 
     - andare simbolo di windows in basso a sinistra e aprire la finestra
     -  scrivere:  ```cmd.exe```
     -  schiacciare sull'icona e avviare il prompt dei comandi
	   
    
2) [non necessario se già presente] <b>installare docker</b>
     - Verificare se docker è installato scrivendo sul prompt precedentemente aperto:
			```docker --version```
     - se va in errore entrare sul sito https://www.docker.com/ e scaricare docker e seguire gli step di installazione
     - avviare il servizio di docker: 
		</br>	```net start com.docker.service```</br>
		(NOTA: per questa operazione serve un prompt avviato come admin: ripetere passaggio 1, schiacciare con tasto destro su icona e selezionare "esegui come amministratore")
	
3) **collegare la repository di github** dove è presente il docker registry con il server node (cioè dove è il programma). </br> Scrivere sul prompt:
   ```
   export CR_PAT= [ --- TOKEN ACCESS --- ]
   echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
   ```
	
4) **eseguire docker**:    
   a questo punto basterà eseguire il seguente comando per avviare il programma:</br>
			```docker compose up```
	
5) **visualizazione sito**:   
    è possibile visualizzare il sito aprendo un browser e inserndo come url il seguente indirizzo:
			http://localhost:3000

</br>
Per eventuali dubbi far riferimento a https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry </br>
In caso sia necessario far una pull del dockerfile: 

```
docker pull ghcr.io/chiesa/node_inventario:1
```
</br></br>
**NOTA:** è possibile vedere il codice del programma nel branch "code"
