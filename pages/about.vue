<template>
  <div>
    <TheTitle title="About"/>
    <TheSubTitle subtitle="Project Description"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      This project has created a series of network visualizations for connections between Anglophone LGBTQ+ exile writers from 1900 to 1969. During this period, American and British writers, including canonical figures such as Gertrude Stein, Christopher Isherwood, James Baldwin, and Paul Bowles, relocated from their native environments to continental Europe and North Africa, principally Capri, Paris, Berlin, and Tangier. This relocation was in part motivated by their sexuality, since both the US and the UK had established legal structures for the persecution of homosexuals during this period. In contrast, countries such as France and Italy had no legal framework for such persecution, and both Berlin and Tangier tolerated homosexuality within certain limits. By resettling, these writers helped to establish a widespread LGBTQ+ exile literary network. The visualizations on this site demonstrate the complex webs of attachment that existed between these writers. They capture both their movements and creative exchanges across borders. These visualizations draw on an initial data sample from the published memoirs and letter collections of a range of LGBTQ+ exile writers (see Sources). The project demonstrates that these diverse communities were intimately connected and dynamically linked by the movement of LGBTQ+ exile writers.
    </div>
    <TheSubTitle subtitle="Project Leader Biography"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Benjamin Robbins, PhD is a senior postdoctoral researcher in American literary and cultural studies within the Department for American Studies at the University of Innsbruck and project leader of “Networked Narratives: Queer Exile Literature 1900-1969,” which is funded by the Austrian Science Fund (FWF). He is the author of 
        <span class="italic">Faulkner's Hollywood Novels: Filmic Womanhood on Page and Screen</span> 
      (University of Virginia Press, forthcoming 2024). His work in the research areas of modernism, popular culture, and queer and gender studies has appeared in the 
        <span class="italic">Journal of Screenwriting,</span> 
      the 
        <span class="italic">Faulkner Journal</span>, 
      and 
        <span class="italic">Genre,</span> 
      and in the edited collections 
        <span class="italic">Faulkner and the Black Literatures of the Americas and Hipster Culture.</span> 
      He is a senior collaborating editor for Digital Yoknapatawpha, a project based at the University of Virginia that has created network visualizations, interactive maps, and timelines for William Faulkner’s fictions. His work within the digital humanities has been published in 
        <span class="italic">Studies in American Culture</span> 
      (which received the Jerome Stern Award) and 
        <span class="italic">Digitizing Faulkner.</span> 
    </div>
    <TheSubTitle subtitle="Credits"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      This project is funded by the Austrian Science Fund (FWF). <br><br>
Previous funding has been provided by the Digital Humanities Research Center at the University of Innsbruck—within the scope of their DI4DH (“Digitization and Information Extraction for the Digital Humanities”) program funded through the Austrian Federal Ministry for Science, Research, and the Economy—and the State of Vorarlberg (Amt der Vorarlberger Landesregierung), as part of their program to support academic work with a connection to Vorarlberg. <br><br>
Assistance in the conceptualization and design of the project database has been provided by Worthy Martin (Associate Professor in the Department of Computer Science, University of Virginia, United States) and Simon Siegert (IT-Systems Engineer, Potsdam, Germany). The visualizations website was designed by Siegert and Loris Mat (Data Visualization Designer, Montpellier, France). The data entry was completed by both Benjamin Robbins and Johanna Unterholzner (University of Innsbruck).

    <div class="py-8">
      <img class="max-w-xs mx-auto py-4" src="/images/logo_fwf.png" alt="FWF Logo">
      <img class="max-w-xs mx-auto py-4" src="/images/logo_vorarlberger.png" alt="Vorarlberger Logo">
    </div>

    </div>
    <TheSubTitle subtitle="Sources"/>
    <div class="mx-auto text-gray-800 max-w-3xl">
      Douglas, Norman. <span class='italic'> Looking Back: An Autobiographical Excursion.</span> Harcourt, Brace, and Company, 1933/1971. 
      <br><br>Douglas, Norman. 
      <span class='italic'>Norman Douglas Selected Correspondence, Volume 6, Dear Sir (or Madam): Letters of Norman Douglas to Bryher and Two Letters from Bryher to Douglas. </span>Ed. Arthur S. Wensinger and Michael Allan. W. Neugebauer Verlag, 2013.
      <br><br>Douglas, Norman. 
      <span class='italic'>Norman Douglas Selected Correspondence, Volume 11, Uncle Norman: Miscellaneous Letters to and from Norman Douglas 1922-1951. </span>Ed. Arthur S. Wensinger and Michael Allan. W. Neugebauer Verlag, 2013.
      <br><br>Flanner, Janet. 
      <span class='italic'>Paris Was Yesterday: 1925-1969.</span> Virago, 2003.
      <br><br>Hamilton, Gerald. 
      <span class='italic'>The Way it Was With Me.</span> Leslie Frewin, 1969.
      <br><br>Isherwood, Christopher. 
      <span class='italic'>Christopher and His Kind.</span> University of Minnesota Press, 1976/2001.
      <br><br>Isherwood, Christopher. 
      <span class='italic'>Liberation: Diaries, Volume Three: 1970-1983.</span> Vintage, 2013.
      <br><br>Isherwood, Christopher. 
      <span class='italic'>Lions and Shadows.</span> Vintage, 1938/2013.
      <br><br>Lehmann, John. 
      <span class='italic'>The Whispering Gallery: Autobiography, Vol. 1.</span> Longmans, Green, and Co, 1956.
      <br><br>Lehmann, John. 
      <span class='italic'>Christopher Isherwood: A Personal Memoir.</span> Weidenfeld and Nicolson, 1987.
      <br><br>Mackenzie, Compton. 
      <span class='italic'>My Life and Times, Octave Four 1907-1915.</span> Chatto and Windus, 1965.
      <br><br>Spender, Stephen. 
      <span class='italic'>World Within World.</span> Hamish Hamilton, 1951.


    </div>

  </div>
</template>

<script setup>

const isViz = useState('isViz')
onMounted(() => {
  isViz.value = false;
})

</script>