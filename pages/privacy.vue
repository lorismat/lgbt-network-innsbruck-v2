<template>
  <div>

    <TheTitle title="Privacy Policy"/>
    <h2>Privacy information for visitors to the website</h2>

    <div class="mx-auto text-gray-800 max-w-3xl text-justify">
    
      <h3>Website</h3>

      <h4>Purpose</h4>
      <p>
        If you only use our website to retrieve information, it is generally not necessary for you to provide personal data. However, for the operation of the website it is necessary to process certain data through which a personal reference can be established. In this case, it is only those data that are transmitted to us by your Internet browser. These are in particular the following:
        <br><br>
        <ul>
          <li class="pl-4">• Date and time of the retrieval of one of our Internet pages</li>
          <li class="pl-4">• Your browser type</li>
          <li class="pl-4">• The browser settings</li>
          <li class="pl-4">• The operating system used</li>
          <li class="pl-4">• The last page you visited</li>
          <li class="pl-4">• The amount of data transferred and the access status (file transferred, file not found, etc.)</li>
          <li class="pl-4">• Your IP address</li>

        </ul>
      </p>
      <h4>Legal basis</h4>
      <p>
        The legal basis for this is our legitimate interest (§ 96 para 3 TKG 2003, Art 6 para 1 lit f DSGVO), which is to ensure the operation of the website, the performance of an error and availability analysis, and the defense against attacks.
      </p>
      <h4>Recipients</h4>
      <p>
        If necessary for the above-mentioned purposes, your personal data will only be transmitted to IT service providers used by us.      </p>
      <h4>Storage period</h4>
      <p>
        The data will only be stored for a maximum of 32 days, unless there is a legal obligation to retain it beyond that. At the same time, longer storage may take place insofar as this is necessary to investigate detected attacks on our website.      </p>
      <h4>Transmission to third countries</h4>
      <p>
        A transmission to a third country does not take place. The website is hosted on our own servers.
      </p>

      <h3>Use of cookies</h3>
      <p>
        In order to make visiting our website attractive, we use cookies that enable the use of certain functions on the website. Cookies are small text files that are temporarily stored on your computer. They do not interfere with the system and cannot cause any damage. Most browsers are configured to accept cookies automatically. However, you can also set your browser so that you are either informed about the setting of cookies, decide on a case-by-case basis whether to accept them, or generally exclude the acceptance of cookies. If you do not accept cookies, the functionality of our website may be limited. Under the menu item “Help” you will find information in common browsers on how to accept or reject cookies.
      </p>

      <h4>Necessary cookies</h4>
      <p>
        Certain technical cookies are necessary to enable the operation of a website at all. These technically necessary cookies are used for visitors to the website only primarily to control certain sessions. I.e. after the respective session, when the browser is closed, they are automatically deleted again. The legal basis for their use is our legitimate interest (§ 96 para 3 TKG 2003, Art 6 para 1 lit f DSGVO) to ensure the operation of the website.      </p>
      <h4>Legal basis</h4>
      <p>
        The legal basis for the setting of cookies and the associated data processing is our legitimate interest - already explained in the purpose - according to § 96 para 3 TKG 2003, Art 6 para 1 lit f DSGVO.      
      </p>
      <h4>Recipients</h4>
      <p>
        Your personal data will not be forwarded to third parties.
      </p>
      <h4>Storage period</h4>
      <p>
        Personal data is not stored. You can delete the cookies manually at any time.
      </p>
      <h4>Transmission to third countries</h4>
      <p>
        A transfer to a third country does not take place.
      </p>

      <h3>Open Street Maps</h3>
      <p>
        Our website also uses map services provided by the OpenStreetMap Foundation, 132 Maney Hill Road, Sutton Coldfield, West Midlands B72 1JU, United Kingdom (short OSMF). Your internet browser or application will be connected to servers operated by OSMF in the United Kingdom and other countries. We, as the operator of this website, have no control over these connections and the processing of your data by OSMF. 
        Information about OSMF's use of data can be found at <a href="http://" target="_blank" rel="noopener noreferrer">wiki.osmfoundation.org/wiki/Privacy_Policy </a> .      </p>

      <h3>Your rights, contact details, data protection officer</h3>
      <p>
        You can find more information on the <a href="https://www.uibk.ac.at/datenschutz/index.html.de" target="_blank">main page</a>.
      </p>

      <div class="empty"></div>

      <p>
        The English version of the privacy policy was translated using an automated online translation service and is provided as a courtesy for informational purposes only, 
        without any liability for translation errors. 
        Only the German original is legally binding:  <br>
        <a href="https://www.uibk.ac.at/datenschutz/besucherinnen.html">https://www.uibk.ac.at/datenschutz/besucherinnen.html</a>
      </p>

    </div>

    




  </div>
</template>

<script setup>
const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

</script>

<style scoped>
h2 {
  font-size: 24px;
  margin: auto;
  text-align: center;
}

h3 {
  font-size: 20px;
  margin: 40px 0px 0px 0px; 
}

h4 {
  padding: 20px 0px 0px 0px;
  font-size: 14px;
  font-weight: bold;
}

p {

}

.empty {
  margin: 40px; 
}

a {
  color:rgb(70, 70, 162);
  text-decoration: underline;
}
</style>