(function() {
  var data = {
    "kids": {
      names: ["Shannon", "Cameron", "Zach", "Jillie", "Kyleigh", "Phoebe", "Brooks", "Adam", "Josiah", "Owen"],
      illegal_pairs: [["Shannon", "Cameron"], ["Zach", "Jillie"], ["Phoebe", "Adam"]]
    },
    "grandkids": {
      names: ["Archer", "Felix", "Piper", "Autumn", "Clover", "Landry", "Olive", "Freddie", "Reid", "Skye"],
      illegal_pairs: [
        ["Archer", "Felix"],
        ["Clover", "Skye"],
        ["Clover", "Autumn"],
        ["Clover", "Landry"],
        ["Landry", "Autumn"],
        ["Landry", "Skye"],
        ["Autumn", "Skye"],
        ["Olive", "Freddie"],
        ["Olive", "Reid"],
        ["Freddie", "Reid"]
      ]
    }
  };

  $(function() {
    var pairs;
    pairs = {
      output: [],
      cache: {
        to: [],
        from: []
      },
      report: function(txt) {
        return console.log(txt);
      },
      randIndx: function(arr) {
        return Math.floor(Math.random() * arr.length);
      },
      getValidPair: function() {
        var from_idx, i, p, to_idx, valid_pair;
        p = this.names;
        i = 0;
        while (!(i > 100 || valid_pair)) {
          to_idx = this.randIndx(this.cache.to);
          from_idx = this.randIndx(this.cache.from);
          valid_pair = this.validatePair(this.cache.to[to_idx], this.cache.from[from_idx]);
          i++;
        }
        if (valid_pair) {
          this.cache.to.splice(to_idx, 1);
          this.cache.from.splice(from_idx, 1);
          return valid_pair;
        } else {
          this.report("can't find valid pair");
          return false;
        }
      },
      isIdentical: function(arr1, arr2) {
        return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
      },
      validatePair: function(n1, n2) {
        var ill, _i, _len, _ref;
        this.report("validating " + n1 + " against " + n2);
        if (n1 === n2) {
          this.report("illegal: same");
          return false;
        }
        _ref = this.illegal_pairs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ill = _ref[_i];
          if (this.isIdentical([n1, n2], ill)) {
            this.report("illegal: on list");
            return false;
          }
        }
        this.report("yep");
        return [n1, n2];
      },
      loop: function() {
        var ok, p;
        this.report("trying");
        this.cache.to = this.names.slice(0);
        this.cache.from = this.names.slice(0);
        this.output = [];
        ok = true;
        while (ok && this.cache.to.length) {
          this.report("Cache length: " + this.cache.to.length);
          p = this.getValidPair();
          if (p) {
            this.output.push(p);
          } else {
            this.report("failed");
            ok = false;
          }
        }
        return true;
      },
      loopIsValid: function() {
        return this.output && (this.output.length === this.names.length);
      },
      run: function(e) {
        var pair, _i, _len, _ref, _results;
        this.report("start");
        this.$el = $(e.target).parent();
        this.output = [];
        this.$output = this.$el.find('.output');
        this.$output.empty();

        this.names = data[this.$el.attr('id')].names;
        this.illegal_pairs = data[this.$el.attr('id')].illegal_pairs;

        while (!this.loopIsValid() && this.loop()) {
          this.loop();
        }
        _ref = this.output;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pair = _ref[_i];
          _results.push(this.$output.append($("<p />").text("" + pair[0] + " to " + pair[1])));
        }
        return _results;
      },
      init: function($el) {
        return $el.on("click", ".generate", $.proxy(this.run, this));
      }
    };
    pairs.init($("#kids"));
    pairs.init($("#grandkids"));
  });

}).call(this);
