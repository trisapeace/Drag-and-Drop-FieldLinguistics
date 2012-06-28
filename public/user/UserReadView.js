define([ 
    "use!backbone", 
    "use!handlebars", 
    "text!user/user_read_link.handlebars",
    "text!user/user_read_modal.handlebars",
    "text!user/user_read_fullscreen.handlebars",
    "corpus/Corpus",
    "corpus/Corpuses",
    "user/User",
    "libs/Utils"
], function(
    Backbone, 
    Handlebars, 
    userLinkTemplate,
    userModalTemplate,
    userFullscreenTemplate, 
    Corpus,
    Corpuses,
    User
) {
  var UserReadView = Backbone.View.extend(
  /** @lends UserReadView.prototype */
  {
    /**
     * @class The layout of a single User. This view is used in the activity
     *        feeds, it is also embedable in the UserEditView.
     *        
     * @property {String} format Must be set when the view is initialized. Valid
     *           values are "link" "modal" and "fullscreen".
     * 
     * @description Starts the UserView.
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      Utils.debug("USER init: " + this.el);
      
      this.on('all', function(e) {
        this.render();
      });
      
      this.model.bind('change', this.render);
    },

    /**
     * The underlying model of the UserReadView is a User.
     */
    model : User,
    
    classname : "user",
    
    /**
     * The Handlebars template rendered as the UserReadView.
     */
    linkTemplate : Handlebars.compile(userLinkTemplate),
    modalTemplate : Handlebars.compile(userModalTemplate),
    fullscreenTemplate : Handlebars.compile(userFullscreenTemplate),
    
    /**
     * Renders the UserReadView.
     */
    render : function() {
      
      Utils.debug("USER render: " + this.el);
      if (this.model == undefined) {
        Utils.debug("\User model was undefined");
        return this;
      }
      Utils.debug("\tRendering user: " + this.model.get("username"));

      if(this.format == "fullscreen"){
        this.setElement($("#user-fullscreen"));
        $(this.el).html(this.fullscreenTemplate(this.model.toJSON()));
      }else if(this.format == "modal"){
        this.setElement($("#user-modal"));
        $(this.el).html(this.modalTemplate(this.model.toJSON()));
      }else if(this.format == "link"){
        $(this.el).html(this.linkTemplate(this.model.toJSON()));
      }

      return this;
    },
    
    /**
     * Initializes the sample User (Sapir).
     */
    loadSample : function() {
      // Notes: Sapir's user comes from his time after his PhD and
      // before his foray into the industry. This is when he started
      // getting some results for "phoneme" around 1910.
      // For a similar use of historical users see Morgan Blamey and Tucker the Technician at blamestella.com
      // https://twitter.com/#!/tucker1927
      var oldprefs = this.model.get("prefs");
      this.model.attributes = {
        "username" : "sapir",
        "password" : "phoneme",
        "email" : "esapir@email.com",
        "firstname" : "Ed",
        "lastname" : "Sapir",
        "gravatar" : "user/sapir_1910_gravatar.png",
        "researchInterest" : "Phonology",
        "affiliation" : "University of Pennsylvania",
        "description" : "I am currently a fellow at UPenn. I am interested in soundpatterns of Ute and Southern Paiute languages. I propose that the phoneme is not just an abstraction existing at the structural level of language, but that it in fact has psychological reality for speakers.",
        "subtitle" : "",
        "corpuses" : [],
        "dataLists" : [],
        "prefs" : oldprefs,
        "teams" : []
      };
      var n = new Corpus({title: "test corpus filled in userview", titleAsUrl: "test"});
      var self = this;
      this.model.save(
          null,
          {
            success : function() {
              self.model.get("corpuses").push(n.id);
            },
            error : function() {
              alert("Unable to create new corpus.");
            }
          }
      );

    },
    
    /**
     * Initializes the public User.
     */
    
    loadPublic : function(){
      var oldprefs = this.model.get("prefs");
      this.model.attributes = {
          "username" : "public",
          "password" : "",
          "email" : "",
          "firstname" : "Anonymous",
          "lastname" : "User",
          "gravatar" : "./../user/public_gravatar.png",
          "researchInterest" : "",
          "affiliation" : "",
          "description" : "",
          "subtitle" : "",
          "corpuses" : [],
          "dataLists" : [],
          "prefs" : oldprefs,
          "teams" : []
        };
      var n = new Corpus({title: "test corpus filled in userview", titleAsUrl: "test"});
      var self = this;
      this.model.save(
          null,
          {
            success : function() {
              self.model.get("corpuses").push(n.id);
            },
            error : function() {
              alert("Unable to create new corpus.");
            }
          }
      );
    }
  });

  return UserReadView;
});