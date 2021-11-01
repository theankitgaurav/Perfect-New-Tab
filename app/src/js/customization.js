// The customization component
const customizationComponent = new Vue({
  el: "#main-option",
  mixins: [mixins],
  data: {
    prefs: defaultPreferences,
    fontList: ['Raleway', 'Mulish', 'Roboto', 'Serif'],
  },
  methods: {
    initPrefs: async function () {
      let storedPrefs = await getStorageData('perfect_new_tab_prefs')
      if (!storedPrefs || storedPrefs.isEmpty()) {
        debug("Nothing was stored initially")
        self.prefs = defaultPreferences;
        const res = await setStorageData({ perfect_new_tab_prefs: self.prefs })
      } else {
        debug("Preferences fetched from Store", storedPrefs)
        self.prefs = storedPrefs['perfect_new_tab_prefs']
      }
    },
    reset: function () {
      chrome.storage.sync.clear(() => log("Preferences have been reset"));
    },
    save: async function () {
      const self = this
      const res = await setStorageData({ perfect_new_tab_prefs: self.prefs })
      debug("saved", res, self.prefs)
    }
  },
  created: async function () {
    const self = this;
    await self.initPrefs()
  }
});
