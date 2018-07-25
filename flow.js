const data = 'https://api.myjson.com/bins/dcqym';

Vue.component('card', {
    template:`
<div>
  <h4>Card {{ card.id }}:</h4>
  <h4>{{ titleComputed }}</h4>
  <div>    
    <h4 v-if="card.text[lang].tips.length == 0">{{ mtextComputed }}</h4>
    <h4 v-else>{{ innerComputed[0] }} <div class="tooltip">{{ innerComputed[1] }}<sup>i</sup><span class="tooltiptext">{{ innerComputed[3] }}</span></div> {{ innerComputed[2] }}</h4>
  </div>
  <h6 v-if="card.instructions[lang].length > 0">{{ card.instructions[lang] }}</h6>

  <div v-if="card.type === 'CHECK'">
    <div v-for="(option,index) in chaosComputed.options">
      <input class="no-margin" name="currentCard" v-model="check" :id="index" :value="option" type="checkbox"></input>
      <label class="no-margin" v-if="option.text[lang].tips.length == 0" :for="index">{{ option.text.updt }}</label>
      <label class="no-margin" v-else :for="index">{{ option.text.opts[0] }} <div class="tooltip">{{ option.text.opts[1] }}<sup>i</sup><span class="tooltiptext">{{ option.text.opts[3] }}</span></div> {{ option.text.opts[2] }}</label>        
    </div>
  </div>  

  <div v-if="card.type === 'RADIO'">
    <div v-for="(option,index) in chaosComputed.options">
      <input class="no-margin" name="currentCard" v-model="radio" :id="index" :value="option" type="radio"></input>
      <label class="no-margin" v-if="option.text[lang].tips.length == 0" :for="index">{{ option.text.updt }}</label>
      <label class="no-margin" v-else :for="index">{{ option.text.opts[0] }} <div class="tooltip">{{ option.text.opts[1] }}<sup>i</sup><span class="tooltiptext">{{ option.text.opts[3] }}</span></div> {{ option.text.opts[2] }}</label>
    </div>
  </div>

  <div v-if="card.type === 'INPUT_NUM'">
    <div style="align-items: center; display:flex !important;">
      <span style="padding-right:0.5rem;">{{ labelComputed[0] }}</span>
      <input id="enter" type="text" maxlength="2" v-model="input" onkeypress='return event.charCode >= 48 && event.charCode <= 57' v-bind:style="{ width: card.options[0].width + 'px !important' }"/>
      <span style="padding-left:0.5rem;">{{ labelComputed[1] }}</span>
    </div>
  </div> 

  <div v-if="card.type === 'INPUT_TXT'">
    <div style="align-items: center; display:flex !important;">
      <span style="padding-right:0.5rem;">{{ labelComputed[0] }}</span>
      <input id="enter" v-model="input" type="text" v-bind:style="{ width: card.options[0].width + 'px !important' }"/>
      <span style="padding-left:0.5rem;">{{ labelComputed[1] }}</span>
    </div>
  </div>    
  <br/>

  <div v-if="lang == 'en'">
    <button @click="backCard" class="quiz-button btn" v-if="card.id >= 1">&larr; Back</button>
    <button @click="nextCard" class="quiz-button btn">Next &rarr;</button>        
  </div>
  <div v-else>
    <button @click="backCard" class="quiz-button btn" v-if="card.id >= 1">&larr; Retour</button>
    <button @click="nextCard" class="quiz-button btn">Suivant &rarr;</button>        
  </div>
  <br/>

  {{ dico }}
</div>

`,
  data() {
    return { 
      check: [], 
      radio: '',
      title: '',
      chaos: [],
      mtext: '',
      mtips: [],
      inner: '',
      label: '',
      input: '',
      progressBarWidth: 0,
    }
  },
  created() {    
    // Reset
    this.title = this.card.title[this.lang];
    this.chaos = this.card;
    this.mtext = this.card.text[this.lang].main;
    this.inner = this.card.text[this.lang].main;
    this.mtips = this.card.text[this.lang].tips;
    this.label = this.card.options[0];
  },  
  updated() {    
    // Reset
    this.title = this.card.title[this.lang];
    this.chaos = this.card;
    this.mtext = this.card.text[this.lang].main;
    this.inner = this.card.text[this.lang].main;
    this.mtips = this.card.text[this.lang].tips;
    this.label = this.card.options[0];
    console.log("$$$$$$$$$$ UPDATED $$$$$$$$$$");
    console.log(this.dico);
    if (this.dico['flag'] && ( this.dico['flag'] == 'T')) {
      this.submitForm();
    }
    // TODO:
    // console.log(document.getElementsByTagName('body')[0].innerHTML);
    // document.getElementById("0").checked = true;
    // document.getElementById("1").checked = true;
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  },     
  computed: {
    titleComputed() {
      // Reset
      this.title = this.card.title[this.lang];
      // Replace placeholders
      return this.replaceVar(this.title).toUpperCase();      
    },
    mtextComputed() {
      // Reset
      this.mtext = this.card.text[this.lang].main;
      // Replace placeholders
      return this.replaceVar(this.mtext);
    }, 
    innerComputed() {
      // Reset
      this.inner = this.card.text[this.lang].main;
      this.mtips = this.card.text[this.lang].tips;

      // Replace placeholders
      text = this.replaceVar(this.inner);
      // Divide text in groups for tooltips
      return this.divideTags(text, this.mtips[0].key, this.mtips[0].tip);
    },  
    labelComputed() {
      // Reset
      this.label = this.card.options[0];

      // Replace placeholders
      text = this.replaceVar(this.label.text[this.lang].main);
      // Divide text in two for label
      return this.divideLabel(text);
    },                               
    chaosComputed() {
      this.chaos = this.card;

      var newos = Object.assign({}, this.chaos);
      for (var i = 0; i < newos.options.length; i++) {
        text = newos.options[i].text[this.lang].main;
        // Replace placeholders
        newos.options[i].text.updt = this.replaceVar(newos.options[i].text[this.lang].main);
        tips = newos.options[i].text[this.lang].tips;
        // Divide text
        if (tips.length > 0) {
          arrVars = this.divideTags(newos.options[i].text[this.lang].main, tips[0].key, tips[0].tip);
          newos.options[i].text["opts"] = [arrVars[0], arrVars[1], arrVars[2], arrVars[3]];
        }
      }

      return newos;
    }    
  },     
  props:['card', 'dico', 'lang'],
  methods: {
    replaceVar:function(text) {
      arrTags = text.match(/\#([^#]+)\#/g);
      if (arrTags) {
        for (var i = 0; i < arrTags.length; i++) {  
          text = text.replace(arrTags[i], this.dico[arrTags[i].slice(1, -1)]);
        }
      }
      return text;
    },
    divideTags:function(text, key, tip) {
      arrDiv = [];
      numDiv = text.indexOf(key);
      arrDiv[0] = text.substr(0, numDiv);
      arrDiv[1] = key;
      arrDiv[2] = text.substr(numDiv + key.length, text.length - (numDiv + key.length));
      arrDiv[3] = tip;
      return arrDiv;
    },
    divideLabel:function(text) {
      arrDiv = [];
      numDiv = text.indexOf('%');
      arrDiv[0] = text.substr(0, numDiv - 1);
      arrDiv[1] = text.substr(numDiv + 2, text.length)
      return arrDiv;
    },    
    backCard:function() {  
      this.progressBarWidth = Math.round(this.progressBarWidth - (100/15)); 
      this.$emit('back');      
    },
    nextCard:function() {
      switch (this.card.type) {
        case 'RADIO': {    
          // Assert some options were checked
          if (this.radio) {  

            // TODO:
            // alert(this.radio);
            console.log("*****************************");
            console.log(this.radio);
            console.log("*****************************");

            this.progressBarWidth = Math.round(this.progressBarWidth + (100/15));
            this.$emit('next', { id: this.card.id, lang: this.lang,
              check : null, radio : this.radio, input: null, next: this.card.next });
          }
          break;
        }
        case 'CHECK': { 
          // Assert some options were checked
          if (this.check.length > 0) {

            // TODO:
            // alert(this.check);
            console.log("*****************************");
            console.log(this.check);
            console.log("*****************************");

            this.progressBarWidth = Math.round(this.progressBarWidth + (100/15));
            this.$emit('next', { id: this.card.id, lang: this.lang,
              check : this.check, radio : null, input: null, next: this.card.next });
          }        
          break;
        }
        case 'INPUT_NUM': {

          // TODO:
          // alert(this.input);
          console.log("*****************************");
          console.log(this.input);
          console.log("*****************************");

          this.progressBarWidth = Math.round(this.progressBarWidth + (100/15));
          this.$emit('next', { id: this.card.id, lang: this.lang,
            check : null, radio : null, input: {key: this.label.dico[0].key, val: this.input}, next: this.card.next });
          break;
        }
        case 'INPUT_TXT': {

          // TODO:
          // alert(this.input);
          console.log("*****************************");
          console.log(this.input);
          console.log("*****************************");

          this.progressBarWidth = Math.round(this.progressBarWidth + (100/15));
          this.$emit('next', { id: this.card.id, lang: this.lang,
            check : null, radio : null, input: {key: this.label.dico[0].key, val: this.input}, next: this.card.next });
          break;
        }        
      }

      // Reset
      this.radio = '';
      this.check = [];
      this.input = '';
    },
    /** 
    * Looks at the entries of the matchmaker dictionary that was updated 
    * throughout the whole quiz experience and then directs the user to a 
    * program results page.    
    */
    submitForm:function() {
      // document.getElementById("jsform").submit();
    }
  }
});

const matchmaker = new Vue({
  el:'#matchmaker',
  data() {
    return {
      // Introductory stage of the quiz
      stageIntro: false,
      // Stage that cycles through all cards triggered by a user
      stageCards: false,
      // Array that stores all cards as defined in the JSON file
      cards: [],
      // Array that stores the IDs of all cards that have been visited
      visited: [],
      // ID of the card that is currently being visited
      currentCard: 0,
      // Dictionary that caches information collected from the answers
      // a user gives to the cards they go through
      dico: new Object(),
      // Language of the matchmaker
      lang: '',
      // Stack that stores the state of the matchmaker for every card 
      // that is visited so that the user can freely go back and forth
      // between cards in the matchmaker
      stack: [],

      // TODO:
      check: [], 
      radio: '',
      inpit: ''
    }
  },
  created() {
    this.lang = "en";//document.getElementById("lang").value;
    // Loads JSON file
    fetch(data)
    .then(res => res.json())
    .then(res => {
      this.cards = res.cards;
      this.stageIntro = true;
      this.stageCards = false;
    });   
  },
  methods: {
    /** 
    * Triggers the start of "stageCards" and pushes the initial state of 
    * the matchmaker to the stack that will be used when the user wants
    * to go back in the quiz.
    */    
    initQuiz() {
      // Signals the start of "stageCards"
      this.stageCards = true;
      this.stageIntro = false;
      this.dico = new Object();
      this.lang = "en";//document.getElementById("lang").value;
      // Pushes initial state of the matchmaker to stack  
      this.stack.push({ "stageIntro": false, "stageCards": true, "visited": [], 
        "currentCard": 0, "dico": new Object(), 
        "check": null, "radio": null, "input": null });  
    },
    /** Updates the language of the matchmaker */
    updtLang() {
      //switch(document.getElementById("lang").value) {
        //case 'en': {
          //document.getElementById("lang").value = 'fr';
          //break;
        //}
        //case 'fr': {
          //document.getElementById("lang").value = 'en';
          //break;
        //}
      //}
      //this.lang = document.getElementById("lang").value;
    },

    /** 
    * Adds all entries that correspond to the answers a user selected in a  
    * given card to the matchmaker dictionary that will persist throughout
    * the whole quiz experience.
    */
    addValuesToDictionary(e) {
      // Type: Check  
      if (e.check) {
        for (var i = 0; i < e.check.length; i++) {
          for (var j = 0; j < e.check[i].dico.length; j++) {
            this.dico[e.check[i].dico[j].key] = e.check[i].dico[j].val[e.lang];
          }
        } 
      }
      // Type: Radio
      if (e.radio) {
        for (var i = 0; i < e.radio.dico.length; i++) {
          this.dico[e.radio.dico[i].key] = e.radio.dico[i].val[e.lang];
        }        
      }
      if (e.input) {
        this.dico[e.input.key] = e.input.val;
      }    
    },       

    /** 
    * Determines what should be the next card to present to the user based 
    * on the "next" array of the current card, which contains all possible
    * paths and the conditions that should be met to trigger each of them.
    */    
    determineNextCard(e) {
      // If there is only one possible path, then take it
      if (e.next.length == 1) {
        return e.next[0].id;
      }

      // If there are several possible paths...
      else {        
        // Loop through all possible paths
        for (var i = 0; i < e.next.length; i++) {
          var bool = true;
          var next = null;

          // If a path has no conditions, then take it
          if (e.next[i].conditions.length == 0) {
            return e.next[i].id;
          }

          // Otherwise: Loop through conditions for the path
          for (var j = 0; j < e.next[i].conditions.length; j++) {
            // Keep going if a condition is met
            if (this.dico[e.next[i].conditions[j].key] && 
                this.dico[e.next[i].conditions[j].key] == e.next[i].conditions[j].val[e.lang]) {
              next = e.next[i].id;
            } 
            // Skip path if a condition is not met
            else {
              bool = false;
              break;
            }          
          }

          // If all conditions are met, take that path
          if (bool) {
            return next;
          }
        }
      }
    },

    /** 
    * Looks at the card equivalencies of a given card and determines if
    * one of them has been visited before. 
    */        
    wasVisitedBefore(cardNo) {
      for (var x = 0; x < this.cards[cardNo].equivalencies.length; x++) {        
        if (this.visited.indexOf(this.cards[cardNo].equivalencies[x]) > 0) {
          return true;
        }
      }
      return false;
    },

    /** 
    * Pops the stack, discarding the value that corresponds to the current 
    * state of the matchmaker. Then sets the matchmaker to match its state
    * in the previous card, which is the value at the top of the stack.
    */   
    backCard() {
      // TODO:
      // alert(this.radio);
      // alert(this.check);
      // alert(this.input);

      // TODO:
      //var state = Object.assign({}, this.stack[this.stack.length - 1]);
      this.stack.pop();
      // Get CHECK + RADIO + INPUT from here and SWITCH
      // Activate values in HTML based on these
      //if (state['check']) {
        //for (var i = 0; i < state['check'].length; i++) {
          //alert(state['check'][i].id);
        //}
      //} 
      //if (state['radio']) {
        //alert(state['radio'].id);
      //} 
      //if (state['input']) {
        //console.log("@@@@@@@@@@");
        //console.log(state['input']);
        //console.log("@@@@@@@@@@");
        //alert(state['input']);
      //}                  
      //console.log(document.getElementsByTagName('body')[0].innerHTML);
      //document.getElementById("1").checked = true;

      var state = Object.assign({}, this.stack[this.stack.length - 1]);
      this.stageIntro = state['stageIntro'];
      this.stageCards = state['stageCards'];
      this.visited = Object.assign([], state['visited']);
      this.dico = Object.assign({}, state['dico']);
      this.currentCard = state['currentCard'];    

      //console.log("-----------------------------");
      // console.log(document.getElementsByTagName('body')[0].innerHTML);
    },

    /** 
    * Processes the answers a user gave to the current card and then moves
    * forward to the next card in the matchmaker.
    */         
    nextCard(e) {
      // Adds current card to array of visited cards
      this.visited.push(e.id);
      // Adds all values from current card to the matchmaker dictionary
      this.addValuesToDictionary(e);  

      var me = this;
      var promise = new Promise(function(resolve, reject) {
        me.currentCard = me.determineNextCard(e);
        while ((me.currentCard != -1) && (me.wasVisitedBefore(me.currentCard))) {
          me.currentCard = me.determineNextCard(me.cards[me.currentCard]);
        }    

        if ((me.currentCard == -1) || (!me.wasVisitedBefore(me.currentCard))) {
          resolve();
        }    
      });

      promise.then(function () {
        if (me.currentCard == -1) {        
          me.stageIntro = false;
          me.stageCards = false;
          // The presence of this flag will trigger a submit action in the updated()
          // method of the card component
          me.dico['flag'] = 'T';
        }
      });

      // Pushes the current state of the matchmaker to the stack
      this.stack.push({ "stageIntro": this.stageIntro, "stageCards": this.stageCards, 
        "visited": Object.assign([], this.visited), "currentCard": this.currentCard, 
        "dico": Object.assign({}, this.dico), 
        "check": e.check, "radio": e.radio, "input": e.input }); 
    }
  }
});