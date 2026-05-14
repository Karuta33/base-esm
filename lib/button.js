/**
 * Builder library for WhatsApp interactive messages
 * and AI rich response payloads using Baileys.
 *
 * Created By Nixel
 * wa.me/6282139672290
 *
 * VERSION: 3.1
 */
import { generateWAMessageFromContent, prepareWAMessageMedia } from "@whiskeysockets/baileys";
import crypto from 'crypto';

/**
 * Class representing a Button for interactive WhatsApp messages.
 */
class Button {
    constructor() {
        /** @private {string} Title of the message header */
        this._title = "";
        /** @private {string} Subtitle of the message header */
        this._subtitle = "";
        /** @private {string} Body text of the message */
        this._body = "";
        /** @private {string} Footer text of the message */
        this._footer = "";
        /** @private {Array} Array to hold button objects (new method) */
        this._beton = [];
        /** @private {*} Data object for media (image, video, document, etc.) */
        this._data;
        /** @private {Object} Context info object for message metadata */
        this._contextInfo = {};
        /** @private {number} Index of the current selection */
        this._currentSelectionIndex = -1;
        /** @private {number} Index of the current section */
        this._currentSectionIndex = -1;
        /** @private {number} Type of message; 0 for interactive, other for alternative format */
        this._type = 0;
        /** @private {Array} Array to hold old button objects (V2) */
        this._betonOld = [];
        /** @private {Array} Array to hold messageParamsJson */
        this._params = {};
    }

    /**
     * Set video media for the message.
     * @param {string|Buffer} path - URL or Buffer of the video.
     * @param {object} [options={}] - Additional options for the video media.
     * @returns {Button|Error} Returns the Button instance or an Error if path is missing.
     */
    setVideo(path, options = {}) {
        if (!path) return new Error("Url or buffer needed");
        Buffer.isBuffer(path)
            ? this._data = { video: path, ...options }
            : this._data = { video: { url: path }, ...options };
        return this;
    }
    
    /**
     * Set image media for the message.
     * @param {string|Buffer} path - URL or Buffer of the image.
     * @param {object} [options={}] - Additional options for the image media.
     * @returns {Button|Error} Returns the Button instance or an Error if path is missing.
     */
    setImage(path, options = {}) {
        if (!path) return new Error("Url or buffer needed");
        Buffer.isBuffer(path)
            ? this._data = { image: path, ...options }
            : this._data = { image: { url: path }, ...options };
        return this;
    }
    
    /**
     * Set document media for the message.
     * @param {string|Buffer} path - URL or Buffer of the document.
     * @param {object} [options={}] - Additional options for the document media.
     * @returns {Button|Error} Returns the Button instance or an Error if path is missing.
     */
    setDocument(path, options = {}) {
        if (!path) return new Error("Url or buffer needed");
        Buffer.isBuffer(path)
            ? this._data = { document: path, ...options }
            : this._data = { document: { url: path }, ...options };
        return this;
    }
    
    /**
     * Set custom media for the message.
     * @param {Object} obj - An object representing the media.
     * @returns {Button|string} Returns the Button instance or an error message if the type is incorrect.
     */
    setMedia(obj) {
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            this._data = obj;
        } else {
            return `Type of media must be an Object`;
        }
        return this;
    }
    
    /**
     * Set the title for the message header.
     * @param {string} title - The title text.
     * @returns {Button} Returns the Button instance.
     */
    setTitle(title) {
        this._title = title;
        return this;
    }
    
    /**
     * Set the subtitle for the message header.
     * @param {string} subtitle - The subtitle text.
     * @returns {Button} Returns the Button instance.
     */
    setSubtitle(subtitle) {
        this._subtitle = subtitle;
        return this;
    }

    /**
     * Set the body text of the message.
     * @param {string} body - The main content of the message.
     * @returns {Button} Returns the Button instance.
     */
    setBody(body) {
        this._body = body;
        return this;
    }

    /**
     * Set the footer text of the message.
     * @param {string} footer - The footer text.
     * @returns {Button} Returns the Button instance.
     */
    setFooter(footer) {
        this._footer = footer;
        return this;
    }
    
    /**
     * Set context information for the message.
     * @param {Object} obj - An object representing context info.
     * @returns {Button|string} Returns the Button instance or an error message if the type is incorrect.
     */
    setContextInfo(obj) {
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            this._contextInfo = obj;
        } else {
            return `Type of contextInfo must be an Object`;
        }
        return this;
    }
    
    /**
     * Set params information for the message.
     * @param {Object} obj - An object representing context info.
     * @returns {Button|string} Returns the Button instance or an error message if the type is incorrect.
     */
    setParams(obj) {
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            this._params = obj;
        } else {
            return `Type of params must be an Object`;
        }
        return this;
    }
    
    /**
     * Set a variable/property of the Button instance.
     * @param {string} name - The property name.
     * @param {*} value - The value to assign.
     * @returns {Button|string} Returns the Button instance or an error message if the property is not found.
     */
    setVariabel(name, value) {
        if (!this.hasOwnProperty(name)) return `Cannot find variabel ${name}, try getVariabelList()`;
        this[name] = value;
        return this;
    }
    
    /**
     * Get the value of a variable/property from the Button instance.
     * @param {string} name - The property name.
     * @returns {*} Returns the value of the property or an error message if not found.
     */
    getVariabel(name) {
        if (!this.hasOwnProperty(name)) return `Cannot find variabel ${name}, try getVariabelList()`;
        return this[name];
    }
    
    /**
     * Get a list of all variable/property names of the Button instance.
     * @returns {Array<string>} Returns an array of property names.
     */
    getVariabelList() {
        return Object.keys(this);
    }
    
    /**
     * Add a button to the message.
     * @param {string} name - The name/type of the button.
     * @param {object} params - The parameters for the button in JSON format.
     * @returns {Button} Returns the Button instance.
     */
    setButton(name, params) {
        this._beton.push({ name, buttonParamsJson: JSON.stringify(params) });
        return this;
    }
    
    /**
     * Add a button using the V2 method.
     * @param {object} params - The parameters for the button.
     * @returns {Button} Returns the Button instance.
     */
    setButtonV2(params) {
        this._betonOld.push(params);
        return this;
    }

    /**
     * Create a row in a button section.
     * @param {string} [header=""] - The header text for the row.
     * @param {string} [title=""] - The title text for the row.
     * @param {string} [description=""] - The description text for the row.
     * @param {string} [id=""] - The identifier for the row.
     * @throws Will throw an error if selection or section has not been created.
     * @returns {Button} Returns the Button instance.
     */
    makeRow(header = "", title = "", description = "", id = "") {
        if (this._currentSelectionIndex === -1 || this._currentSectionIndex === -1) {
            throw new Error("You need to create a selection and a section first");
        }
        const buttonParams = JSON.parse(this._beton[this._currentSelectionIndex].buttonParamsJson);
        buttonParams.sections[this._currentSectionIndex].rows.push({ header, title, description, id });
        this._beton[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams);
        return this;
    }

    /**
     * Create a new section in the current selection.
     * @param {string} [title=""] - The title of the section.
     * @param {string} [highlight_label=""] - The highlight label for the section.
     * @throws Will throw an error if no selection exists.
     * @returns {Button} Returns the Button instance.
     */
    makeSections(title = "", highlight_label = "") {
        if (this._currentSelectionIndex === -1) {
            throw new Error("You need to create a selection first");
        }
        const buttonParams = JSON.parse(this._beton[this._currentSelectionIndex].buttonParamsJson);
        buttonParams.sections.push({ title, highlight_label, rows: [] });
        this._currentSectionIndex = buttonParams.sections.length - 1;
        this._beton[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams);
        return this;
    }

    /**
     * Add a new selection for buttons.
     * @param {string} title - The title of the selection.
     * @returns {Button} Returns the Button instance.
     */
    addSelection(title) {
        this._beton.push({ name: "single_select", buttonParamsJson: JSON.stringify({ title, sections: [] }) });
        this._currentSelectionIndex = this._beton.length - 1;
        this._currentSectionIndex = -1;
        return this;
    }

    /**
     * Add a quick reply button.
     * @param {string} [display_text=""] - The text displayed on the button.
     * @param {string} [id=""] - The identifier for the button.
     * @returns {Button} Returns the Button instance.
     */
    addReply(display_text = "", id = "") {
        this._beton.push({ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text, id }) });
        return this;
    }
    
    /**
     * Add a quick reply button using V2 method.
     * @param {string} [displayText="Nixel"] - The text to display on the button.
     * @param {string} [buttonId="Nixel"] - The button ID.
     * @returns {Button} Returns the Button instance.
     */
    addReplyV2(displayText = "Nixel", buttonId = "Nixel") {
        this._betonOld.push({ buttonId, buttonText: { displayText }, type: 1 });
        this._type = 1;
        return this;
    }
    
    /**
     * Add a call-to-action button for calling.
     * @param {string} [display_text=""] - The text to display on the button.
     * @param {string} [id=""] - The identifier for the button.
     * @returns {Button} Returns the Button instance.
     */
    addCall(display_text = "", id = "") {
        this._beton.push({
            name: "cta_call",
            buttonParamsJson: JSON.stringify({
                display_text,
                id
            })
        });
        return this;
    }
    
    /**
     * Add a reminder call-to-action button.
     * @param {string} [display_text=""] - The text to display on the button.
     * @param {string} [id=""] - The identifier for the button.
     * @returns {Button} Returns the Button instance.
     */
    addReminder(display_text = "", id = "") {
        this._beton.push({
            name: "cta_reminder",
            buttonParamsJson: JSON.stringify({
                display_text,
                id
            })
        });
        return this;
    }
    
    /**
     * Add a cancel reminder call-to-action button.
     * @param {string} [display_text=""] - The text to display on the button.
     * @param {string} [id=""] - The identifier for the button.
     * @returns {Button} Returns the Button instance.
     */
    addCancelReminder(display_text = "", id = "") {
        this._beton.push({
            name: "cta_cancel_reminder",
            buttonParamsJson: JSON.stringify({
                display_text,
                id
            })
        });
        return this;
    }
    
    /**
     * Add an address button.
     * @param {string} [display_text=""] - The text to display on the button.
     * @param {string} [id=""] - The identifier for the button.
     * @returns {Button} Returns the Button instance.
     */
    addAddress(display_text = "", id = "") {
        this._beton.push({
            name: "address_message",
            buttonParamsJson: JSON.stringify({
                display_text,
                id
            })
        });
        return this;
    }
    
    /**
     * Add a button for sending location.
     * @returns {Button} Returns the Button instance.
     */
    addLocation() {
        this._beton.push({
            name: "send_location",
            buttonParamsJson: ""
        });
        return this;
    }

    /**
     * Add a URL button.
     * @param {string} [display_text=""] - The text to display on the button.
     * @param {string} [url=""] - The URL to open when the button is clicked.
     * @param {string} [merchant_url=""] - The merchant URL (if applicable).
     * @returns {Button} Returns the Button instance.
     */
    addUrl(display_text = "", url = "", webview_interaction = false) {
        this._beton.push({
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text,
                url,
                webview_interaction
            })
        });
        return this;
    }

    /**
     * Add a copy button that copies text when clicked.
     * @param {string} [display_text=""] - The text to display on the button.
     * @param {string} [copy_code=""] - The text/code to copy.
     * @param {string} [id=""] - The identifier for the button.
     * @returns {Button} Returns the Button instance.
     */
    addCopy(display_text = "", copy_code = "", id = "") {
        this._beton.push({
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text,
                copy_code,
                id
            })
        });
        return this;
    }
    
    /**
    * display params list
    * @retuns {object} Returns a params object. 
    */
    paramsList() {
	  return {
	    limited_time_offer: {
	      text: "string",
	      url: "string",
	      copy_code: "string",
	      expiration_time: "number"
	    },
	    bottom_sheet: {
	      in_thread_buttons_limit: "number",
	      divider_indices: ["number"],
	      list_title: "string",
	      button_title: "string"
	    }, 
	    tap_target_configuration: {
	    	title: "string", 
		    description: "string", 
			canonical_url: "string", 
			domain: "string", 
			buttonIndex: "number"
	    }
	  };
	}

	/**
	 * Send the interactive message with buttons.
	 *
	 * If _type is 0, sends as an interactive message with new button format.
	 * Otherwise, sends using the old button format.
	 *
	 * Bypass mode:
	 * - When enabled via options.bypass = true
	 * - Forces WhatsApp to render button UI even on patched clients
	 * - Works by injecting a dummy locationMessage + headerType: 6
	 * - This tricks WhatsApp UI into treating the message as a supported interactive payload
	 *
	 * @param {string} jid - The target chat ID.
	 * @param {object} conn - The WhatsApp connection object.
	 * @param {object} quoted - The quoted message (if any).
	 * @returns {Promise<object>} Returns a promise that resolves to the sent message object.
	 */
    async run(jid, conn, quoted = '', { bypass = false, ...options } = {}) {
        if (this._type === 0) { 
            const message = {
                body: {
                	text: this._body
                }, 
                footer: {
                	text: this._footer
                }, 
                header: { 
                    title: this._title, 
                    subtitle: this._subtitle, 
                    hasMediaAttachment: !!this._data, 
                    ...(this._data ? await prepareWAMessageMedia(this._data, { upload: conn.waUploadToServer }) : {}) 
                }
            };

            const msg = generateWAMessageFromContent(jid, {
                        interactiveMessage: {
                            ...message,
                            contextInfo: this._contextInfo,
                            nativeFlowMessage: {
                            	messageParamsJson: JSON.stringify(this._params), 
                                buttons: this._beton
                            }
                        }
            }, { quoted });

            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id, additionalNodes: [{
				    	tag: 'biz',
				    	attrs: {},
			    		content: [{
						    tag: 'interactive',
						   	attrs: { type: 'native_flow', v: '1' },
					    	content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }],
				    	}],
			    }], 
...options });
            return msg;
        } else {
            const msg = generateWAMessageFromContent(jid, {
              buttonsMessage: {
				  ...(this._data ? this._data : {}),
				  [this._data ? "caption" : "contentText"]: this._body,
				  title: (!!this._data ? null : this._title),
				  footerText: this._footer,
				  ...(bypass
				    ? {
				        headerType: 6,
				        locationMessage: {}
				      }
				    : {}),
				  viewOnce: true,
				  contextInfo: this._contextInfo,
				  buttons: [
				    ...this._betonOld,
				    ...this._beton.map(nixel => ({
				      buttonId: "Nixel",
				      buttonText: {
				        displayText: "Nixel"
				      },
				      type: 1,
				      nativeFlowInfo: {
				        name: nixel.name,
				        paramsJson: nixel.buttonParamsJson
				      }
				    }))
				  ]
				}
			}, { quoted, ...options }) 

			await conn.relayMessage(msg.key.remoteJid, msg.message, {
			    messageId: msg.key.id,
			    additionalNodes: [{
			        tag: 'biz',
			        attrs: {},
			        content: [{
			            tag: 'interactive',
			            attrs: { type: 'native_flow', v: '1' },
			            content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
			        }]
			    }], 
				...options
			})
			return msg;
        }
    }
}

/**
 * Class for constructing rich AI response payloads (multi-format: text, code, table, media).
 * @class
 */
class AIRich {
	/**
   * Initialize AIRich instance.
   */
  constructor() {
    /** @private @type {Array<Object>} Internal submessage payloads */
    this._submessages = []

    /** @private @type {Array<Object>} Unified response sections */
    this._sections = []

    /** @private @type {Array<Object>} Sources metadata for rich responses */
    this._richResponseSources = []
  }
  
  /**
   * Add plain text content.
   * @param {string} text - Text content.
   * @returns {AIRich}
   */
  addText(text) {
    this._submessages.push({
      messageType: 2,
      messageText: text
    })
    
    this._sections.push({
      view_model: {
        primitive: {
          text,
          __typename: "GenAIMarkdownTextUXPrimitive"
        },
        __typename: "GenAISingleLayoutViewModel"
      }
    })

    return this
  }
  
  /**
   * Add syntax-highlighted code block.
   * @param {string} language - Programming language.
   * @param {string} code - Code string.
   * @returns {AIRich}
   */
  addCode(language, code) {
    const meta = this.tokenizer(code, language)

    this._submessages.push({
      messageType: 5,
      codeMetadata: {
        codeLanguage: language,
        codeBlocks: meta.codeBlock
      }
    })

    this._sections.push({
      view_model: {
        primitive: {
          language,
          code_blocks: meta.unified_codeBlock,
          __typename: "GenAICodeUXPrimitive"
        },
        __typename: "GenAISingleLayoutViewModel"
      }
    })

    return this
  }
  
  /**
   * Add table content.
   * @param {Array<Array<string>>} table - Table in 2D array format (first row = header).
   * @returns {AIRich}
   */
  addTable(table) {
    const meta = this.toTableMetadata(table)

    this._submessages.push({
      messageType: 4,
      tableMetadata: {
        title: meta.title,
        rows: meta.rows
      }
    })

    this._sections.push({
      view_model: {
        primitive: {
          rows: meta.unified_rows,
          __typename: "GenATableUXPrimitive"
        },
        __typename: "GenAISingleLayoutViewModel"
      }
    })

    return this
  }
  
  /**
   * Add external sources (search-like results).
   * @param {Array<[string, string, string]>} sources - Array of tuples [faviconUrl, url, title].
   * @returns {AIRich}
   */
  addSource(sources = []) {
	  const source = sources.map(([profile_url, url, text]) => ({
	    source_type: "THIRD_PARTY",
	    source_display_name: text,
	    source_subtitle: "AI",
	    source_url: url,
	    favicon: {
	          url: profile_url,
	          mime_type: "image/jpeg",
	          width: 16,
	          height: 16,
	        }
	  }));
	
	  this._sections.push({
	    view_model: {
	      primitive: {
	        sources: source,
	        __typename: "GenAISearchResultPrimitive",
	      },
	      __typename: "GenAISingleLayoutViewModel",
	    },
	  });
	
	  return this;
	}
	
	/**
   * Add reels/video content.
   * @param {Array<Object>} reelsItems - Reel items.
   * @param {string} reelsItems[].title - Creator/title.
   * @param {string} reelsItems[].profileIconUrl - Avatar URL.
   * @param {string} reelsItems[].thumbnailUrl - Thumbnail URL.
   * @param {string} reelsItems[].videoUrl - Video URL.
   * @param {string} [reelsItems[].reels_title] - Optional reel title.
   * @param {boolean} [reelsItems[].is_verified] - Verification status.
   * @returns {AIRich}
   */
	addReels(reelsItems = []) {
		this._submessages.push({
	        messageType: 9,
	        contentItemsMetadata: {
	            contentType: 1,
	            itemsMetadata: reelsItems.map(item => ({
	                reelItem: {
	                    title: item.title,
	                    profileIconUrl: item.profileIconUrl,
	                    thumbnailUrl: item.thumbnailUrl,
	                    videoUrl: item.videoUrl
	                }
	            }))
	        }
	    })
	
		reelsItems.forEach((item, idx) => {
		  this._richResponseSources.push({
		    provider: "UNKNOWN",
		    thumbnailCDNURL: item.thumbnailUrl,
		    sourceProviderURL: item.videoUrl,
		    sourceQuery: "",
		    faviconCDNURL: item.profileIconUrl,
		    citationNumber: idx + 1,
		    sourceTitle: item.title
		  });
		});
		
		this._sections.push({
            view_model: {
                primitives: reelsItems.map(item => ({
                    reels_url: item.videoUrl,
                    thumbnail_url: item.thumbnailUrl,
                    creator: item.title,
                    avatar_url: item.profileIconUrl,
                    reels_title: item.reels_title,
                    likes_count: 0, 
                    shares_count: 0,
                    view_count: 0,
                    reel_source: "IG", 
                    is_verified: item.is_verified,
                    __typename: "GenAIReelPrimitive"
                })),
                __typename: "GenAIHScrollLayoutViewModel"
            }
        }) 
        
        return this;
	}
	
	/**
 * Add image content into rich AI response.
 * Supports single image URL or multiple image URLs.
 *
 * @param {string|string[]} imageUrl - Image URL or array of image URLs.
 * @returns {AIRich} Returns AIRich instance for chaining.
 */
	addImage(imageUrl) {
	    const imageUrls = Array.isArray(imageUrl)
	        ? imageUrl.map(url => ({
	            imagePreviewUrl: url,
	            sourceUrl: "https://google.com"
	        }))
	        : [{
	            imagePreviewUrl: imageUrl,
	            sourceUrl: "https://google.com"
	        }]
	
	    this._submessages.push({
	        messageType: 1,
	        gridImageMetadata: {
	            gridImageUrl: {
	                imagePreviewUrl: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl
	            },
	            imageUrls
	        }
	    })
	
	    imageUrls.forEach(({ imagePreviewUrl }) => {
	        this._sections.push({
	            view_model: {
	                primitive: {
	                    media: {
	                        url: imagePreviewUrl,
	                        mime_type: "image/jpeg"
	                    },
	                    imagine_type: 3,
	                    status: {
	                        status: "READY"
	                    },
	                    __typename: "GenAIImaginePrimitive"
	                },
	                __typename: "GenAISingleLayoutViewModel"
	            }
	        })
	    })
	
	    return this
	}
	
	/**
   * Build final payload.
   * @param {Object} [options]
   * @param {boolean} [options.forwarded=true] - Mark message as forwarded.
   * @param {boolean} [options.includesUnifiedResponse=true] - Include unifiedResponse payload.
   * @returns {Object} Built message payload.
   */
  build({ forwarded = true, includesUnifiedResponse = true } = {}) {
  	const contextInfo = forwarded
  ? {
      forwardingScore: 1,
      isForwarded: true,
      forwardedAiBotMessageInfo: { botJid: "0@bot" },
      forwardOrigin: 4
    }
  : {};
  
    return {
    messageContextInfo: {
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
      botMetadata: {
        pluginMetadata: {},
        richResponseSourcesMetadata: { sources: this._richResponseSources }
      }
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: this._submessages,
          unifiedResponse: {
            data: includesUnifiedResponse ? Buffer.from(JSON.stringify({ response_id: crypto.randomUUID(), sections: this._sections })).toString('base64') : ""
          },
          contextInfo
        }
      }
    }
   }
  }
  
  /**
   * Send built message via WhatsApp relay.
   * @param {string} chat - Chat JID.
   * @param {Object} conn - Baileys connection instance.
   * @param {Object} [options]
   * @param {boolean} [options.forwarded] - Forward flag override.
   * @param {boolean} [options.includesUnifiedResponse] - IncludesUnifiedResponse flag override.
   * @returns {Promise<Object>}
   */
  async run(chat, conn, { forwarded, includesUnifiedResponse, ...options } = {}) {
    const payload = this.build({ forwarded, includesUnifiedResponse })

    return await conn.relayMessage(chat, payload, { ...options })
  }
  
  /**
   * Tokenize code into syntax-highlight metadata.
   * @param {string} code - Source code.
   * @param {string} [lang="javascript"] - Language identifier.
   * @returns {{
   *   codeBlock: Array<{codeContent: string, highlightType: number}>,
   *   unified_codeBlock: Array<{content: string, type: string}>
   * }}
   */
  tokenizer(code, lang = "javascript") {
    const keywordsMap = {
      javascript: new Set([
        'break','case','catch','continue','debugger','delete','do','else','finally',
        'for','function','if','in','instanceof','new','return','switch','this','throw',
        'try','typeof','var','void','while','with','true','false','null','undefined',
        'class','const','let','super','extends','export','import','yield','static',
        'constructor','async','await','get','set'
      ])
    }

    const TYPE_MAP = {
      0: "DEFAULT",
      1: "KEYWORD",
      2: "METHOD",
      3: "STR",
      4: "NUMBER",
      5: "COMMENT"
    }

    const keywords = keywordsMap[lang] || new Set()
    const tokens = []

    let i = 0

    const push = (content, type) => {
      if (!content) return
      const last = tokens[tokens.length - 1]
      if (last && last.highlightType === type) last.codeContent += content
      else tokens.push({ codeContent: content, highlightType: type })
    }

    while (i < code.length) {
      const c = code[i]

      if (/\s/.test(c)) {
        let s = i
        while (i < code.length && /\s/.test(code[i])) i++
        push(code.slice(s, i), 0)
        continue
      }

      if (c === "/" && code[i + 1] === "/") {
        let s = i
        i += 2
        while (i < code.length && code[i] !== "\n") i++
        push(code.slice(s, i), 5)
        continue
      }

      if (c === '"' || c === "'" || c === '`') {
        let s = i
        const q = c
        i++
        while (i < code.length) {
          if (code[i] === "\\" && i + 1 < code.length) i += 2
          else if (code[i] === q) { i++; break }
          else i++
        }
        push(code.slice(s, i), 3)
        continue
      }

      if (/[0-9]/.test(c)) {
        let s = i
        while (i < code.length && /[0-9.]/.test(code[i])) i++
        push(code.slice(s, i), 4)
        continue
      }

      if (/[a-zA-Z_$]/.test(c)) {
        let s = i
        while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++
        const word = code.slice(s, i)

        let type = 0
        if (keywords.has(word)) type = 1
        else {
          let j = i
          while (j < code.length && /\s/.test(code[j])) j++
          if (code[j] === "(") type = 2
        }

        push(word, type)
        continue
      }

      push(c, 0)
      i++
    }

    return {
      codeBlock: tokens,
      unified_codeBlock: tokens.map(t => ({
        content: t.codeContent,
        type: TYPE_MAP[t.highlightType]
      }))
    }
  }
  
  /**
   * Convert 2D array into table metadata format.
   * @param {Array<Array<string>>} arr - Table array.
   * @throws {Error} If invalid format.
   * @returns {{
   *   title: string,
   *   rows: Array<Object>,
   *   unified_rows: Array<{is_header: boolean, cells: string[]}>
   * }}
   */
  toTableMetadata(arr) {
    if (!Array.isArray(arr) || arr.length < 2)
      throw new Error("Format tabel ngawur")

    const [header, ...rows] = arr

    const maxLen = Math.max(
      header.length,
      ...rows.map(r => r.length)
    )

    const normalize = (r) => [
      ...r,
      ...Array(maxLen - r.length).fill("")
    ]

    const unified_rows = [
      {
        is_header: true,
        cells: normalize(header)
      },
      ...rows.map(r => ({
        is_header: false,
        cells: normalize(r)
      }))
    ]

    const rowsMeta = unified_rows.map(r => ({
      items: r.cells,
      ...(r.is_header ? { isHeading: true } : {})
    }))

    return {
      title: "",
      rows: rowsMeta,
      unified_rows
    }
  }
}

export { Button, AIRich };