// Generated by CoffeeScript 1.10.0
(function() {
  var app, name, sections;

  sections = ["previously reported issues", "missing group affiliations", "missing hospital affiliations", "missing languages", "missing networks", "missing plans", "missing offices", "missing specialties", "random providers"];

  window.onbeforeunload = function() {
    return "!";
  };

  app = new Vue({
    el: '#app',
    data: {
      sections: (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = sections.length; j < len; j++) {
          name = sections[j];
          results.push({
            name: name,
            issues: [
              {
                pks: "",
                issue: ""
              }
            ],
            enabled: false
          });
        }
        return results;
      })(),
      numProviders: "",
      spotCheck: false,
      searches: [
        {
          criteria: [
            {
              k: "",
              v: ""
            }
          ],
          missing: [
            {
              name: "",
              address: ""
            }
          ]
        }
      ]
    },
    methods: {
      newIssue: function(section) {
        if (section.issues[section.issues.length - 1].issue !== "") {
          return section.issues.push({
            pks: "",
            issue: ""
          });
        }
      },
      newSearch: function() {
        if (this.searches[this.searches.length - 1].criteria[0].k !== "") {
          return this.searches.push({
            criteria: [
              {
                k: "",
                v: ""
              }
            ],
            missing: [
              {
                name: "",
                address: ""
              }
            ]
          });
        }
      },
      newCriteria: function(search) {
        if (search.criteria[search.criteria.length - 1].v !== "") {
          return search.criteria.push({
            k: "",
            v: ""
          });
        }
      },
      newMissingProvider: function(search) {
        if (search.missing[search.missing.length - 1].name !== "") {
          return search.missing.push({
            name: "",
            address: ""
          });
        }
      }
    },
    computed: {
      output: function() {
        var criteria, getPks, hasErrors, i, issue, issues, j, k, l, len, len1, len2, len3, m, missing, out, ref, ref1, ref2, ref3, ref4, search, section, skipPks;
        hasErrors = false;
        out = "";
        ref = this.sections;
        for (j = 0, len = ref.length; j < len; j++) {
          section = ref[j];
          if (section.enabled === false) {
            continue;
          }
          issues = "";
          skipPks = {};
          getPks = function(checkIssue) {
            var i, issue, pks, ref1;
            pks = [checkIssue.pks];
            ref1 = section.issues;
            for (i in ref1) {
              issue = ref1[i];
              if (issue.issue === checkIssue.pks) {
                pks.push(issue.pks);
                skipPks[issue.pks] = true;
              }
            }
            return pks.join(", ");
          };
          ref1 = section.issues;
          for (i in ref1) {
            issue = ref1[i];
            if (issue.issue !== "" && (skipPks[issue.pks] == null)) {
              hasErrors = true;
              issues += "- pk " + (getPks(issue)) + ": " + issue.issue + "\n\n";
            }
          }
          out += ("Checked " + section.name + ", ") + (issues.length > 0 ? "issues found:" : "no issues found.") + "\n\n";
          out += issues;
        }
        out += (this.numProviders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0) + " total providers.\n\n";
        ref2 = this.searches;
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          search = ref2[k];
          if (search.criteria[0].k === "") {
            continue;
          }
          out += "Search Criteria:\n";
          ref3 = search.criteria;
          for (l = 0, len2 = ref3.length; l < len2; l++) {
            criteria = ref3[l];
            if (criteria.k === "") {
              continue;
            }
            out += criteria.k + ": " + criteria.v + "\n";
          }
          out += "\n";
          if (search.missing[0].name === "") {
            out += "No missing providers found.\n\n";
          } else {
            hasErrors = true;
            out += "Missing providers:\n\n";
            ref4 = search.missing;
            for (m = 0, len3 = ref4.length; m < len3; m++) {
              missing = ref4[m];
              if (missing.name === "") {
                continue;
              }
              out += "Name: " + missing.name + "\nAddress: " + missing.address + "\n\n";
            }
          }
        }
        if (!hasErrors) {
          out += "Ready for client approval.";
        }
        return out;
      }
    }
  });

}).call(this);
