const mixins = {
  methods: {
    openLink
  }
};

// Footer logic
const footer = new Vue({
  el: '#footer',
  mixins: [mixins],
});

const customizeMenuComponent = new Vue({
  el: '#customize',
  mixins: [mixins],
  data: {
    showCustomizeText: 'hidden',
    prefs: defaultPreferences
  },
  methods: {
    showText: function () {
      this.showCustomizeText = 'visible';
    },
    hideText: function () {
      this.showCustomizeText = 'hidden'
    },
    openOptions: function () {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage()
      } else {
        window.open(chrome.runtime.getURL('options.html'))
      }
    },
    addListener: function () {
      const self = this
      chrome.storage.onChanged.addListener((changes, area) => {
        const changedPrefs = changes.perfect_new_tab_prefs
        if (changedPrefs && changedPrefs.newValue) {
          debug("applied from store")
          self.prefs = changedPrefs.newValue
        } else {
          debug("Applied from default")
          self.prefs = defaultPreferences
        }
        self.applyCustomization()
      });
    },
    applyCustomization: function () {
      const self = this
      debug("before apply function", self.prefs)
      document.querySelectorAll(".panel-heading").forEach(el =>
          el.style.backgroundColor = self.prefs.ui.headbgcolor
      )
      document.querySelector(".main").style.backgroundColor = self.prefs.ui.bodybgcolor;
      document.querySelector("#footer").style.backgroundColor = self.prefs.ui.footerbgcolor;
      document.querySelector(".main").style.fontFamily = self.prefs.ui.font;
    }
  },
  created: async function () {
    const self = this;
    self.addListener()
    let storedPrefs = await getStorageData('perfect_new_tab_prefs')
    self.prefs = storedPrefs.perfect_new_tab_prefs ? storedPrefs.perfect_new_tab_prefs : defaultPreferences
    self.applyCustomization()
  }
});



