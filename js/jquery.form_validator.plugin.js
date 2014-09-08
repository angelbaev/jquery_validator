/*!
 * jQuery FormValidator - A JQuery Form Validator Plugin
 *
 * The MIT License
 *
 * @author  : Angel Baev
 * @version : 0.9.1
 *
 */

(function($) {

	$.fn.form_validator = function( options ) {

		var settings = $.extend({
			msg_tag_prefix   : null,
			msg_tag_suffix   : null,
			error_class      : null,
			complete         : null
		}, options);
                

		return this.each( function() {
                        $('input, select, textarea', this).focus(function(){
                          if (typeof($(this).attr('data-rules')) != 'undefined') {
                              if(settings.error_class != null) {
                                $(this).removeClass(settings.error_class);
                              }
                              $('div[for_input=\''+$(this).attr('name')+'\']').remove();
                          }
                        });
    
                    var self = this;
                    this.error_messages = [];
                    this.can_submit = true;
                    
                    /*
                     * Define set_message method
                     */
                    this.set_message = function (msg) {
                      this.error_messages.push(msg);
                    }
                    
                    this.bind_message = function(el) {
                      var messages = [];
                      for(var i in this.error_messages) {
                        messages.push(this.error_messages[i]);
                      }
                      if (messages.length > 0) {
                        if (settings.error_class != null) {
                          $(el).addClass(settings.error_class);
                        }
                        if (settings.msg_tag_prefix != null && settings.msg_tag_suffix != null) {
                          message = '<div for_input="'+$(el).attr('name')+'">'+settings.msg_tag_prefix+''+messages.join()+''+settings.msg_tag_suffix+'</div>';
                        } else {
                          message = '<div for_input="'+$(el).attr('name')+'">'+messages.join()+'</div>';
                        } 
                        if ($('div[for_input*=\''+$(el).attr('name')+'\']').size() == 0 ) {
                          $(el).after(message);
                        }                      
                      }
                    }
                    
                    this.clear_message = function () {
                      this.error_messages = [];
                    }
                    
                    this.parse_errors = function (str) {
                      var errors = {};
                      var _tmp = str.split(',');
                      for(var i in _tmp) {
                        var _err = _tmp[i].toString().split(':'); 
                        if(typeof(_err[1]) != 'undefined') {
                          var error_key = this.trim(_err[0].toString().replace(/'/g, ''));
                          var error_text = this.trim(_err[1].toString().replace(/'/g, ''));
                          errors[error_key] = error_text;
                        } 
                        
                      }
                      return  errors;
                    }
                    
                    /**
                     * Trim
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.trim = function(str) {
                        str = str.toString();
                        return str.trim();
                    }

                    /**
                     * escape
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.escape = function(str) {
                      return (str.replace(/&/g, '&amp;')
                          .replace(/"/g, '&quot;')
                          .replace(/'/g, '&apos;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;'));
                    }

                    /**
                     * Required
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                   this.required = function(str) {
                        return (this.trim(str) === ''? false:true);
                    }

                    /**
                     * Performs a Regular Expression match test.
                     *
                     * @access	public
                     * @param	string
                     * @param	regex
                     * @return	bool
                     */
                    this.regex_match = function(str, regex) {
                        if(!str.match(regex)) {
                           return false;
                        }
                        return true;
                    }

                    /**
                     * Match one field to another
                     *
                     * @access	public
                     * @param	field
                     * @return	bool
                     */
                    this.matches = function(str, field) {
                        //to do check field value
                        return ($('input[name=\''+field+'\']').val() == str? true:false);
                    }
                    
                    /**
                     * Match one field to attribute value
                     *
                     * @access	public
                     * @param	attr_name
                     * @return	bool
                     */
                     /*
                    this.attr_matches = function(str, attr_name) {
                        //to do check attribute value with this field value
                    }
                    */

                    /**
                     * Minimum Length
                     *
                     * @access	public
                     * @param	string
                     * @param	value
                     * @return	bool
                     */
                    this.min_length = function(str, val) {
                        if(val.match(/[^0-9]/)) {
                            return false;
                        }
                        return (str.length < val ? true:false);
                    }

                    /**
                     * Max Length
                     *
                     * @access	public
                     * @param	string
                     * @param	value
                     * @return	bool
                     */
                    this.max_length = function(str, val) {
                        if(val.match(/[^0-9]/)) {
                            return false;
                        }
                        return (str.length > val ? false:true);
                    }

                    /**
                     * Exact Length
                     *
                     * @access	public
                     * @param	string
                     * @param	value
                     * @return	bool
                     */
                    this.exact_length = function(str, val) {
                        if(val.match(/[^0-9]/)) {
                            return false;
                        }
                        return (str.length != val ? false:true);
                    }

                    /**
                     * Valid Email
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.valid_email = function(str) {
                        //filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        //if (filter.test(email.value)) {
                        return (!str.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)?false:true);
                    }

                    /**
                     * Valid URL
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.valid_url = function(str) {
                        return (!str.match(/^(?:(ftp|http|https):\/\/)?(?:[\w\-]+\.)+[a-z]{2,6}([\:\/?#].*)?$/i)?false:true);
                    }

                    /**
                     * Valid Phone
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.phone = function(str) {
                        return (!str.match(/^[2-9]\d{2}-\d{3}-\d{4}$/)?false:true);
                    }

                    /**
                     * Alpha
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.alpha = function(str) {
                        if(!str.match(/^([a-z])+$/i)) {
                           return false;
                        }
                        return true;
                    }

                    /**
                     * Alpha-numeric
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.alpha_numeric = function(str) {
                        if(!str.match(/^([a-z0-9])+$/i)) {
                           return false;
                        }
                        return true;
                    }

                    /**
                     * Alpha-numeric with underscores and dashes
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.alpha_dash = function(str) {
                        if(!str.match(/^([-a-z0-9_-])+$/i)) {
                           return false;
                        }
                        return true;
                    }
                    
                    /**
                     * Numeric
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.numeric = function(str) {
                        if(!str.match(/^[\-+]?[0-9]*\.?[0-9]+$/)) {
                           return false;
                        }
                        return true;
                    }


                    /**
                     * Integer
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.integer = function(str) {
                        return (str.match(/^[\-+]?[0-9]+$/)?true:false);
                    }

                    /**
                     * Float number
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.is_float = function(str) {
                        return (str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)?true:false);
                    }

                   /*
                     * Define decimal method
                     */
                    this.decimal = function(str) {
                        return (str.match(/^[\-+]?[0-9]+\.[0-9]+$/)?true:false);
                    }

                    /**
                     * Decimal number
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.greater_than = function(str, min) {
                        if(!this.numeric(str)) {
                            return false;
                        }
                        return str > min;
                    }

                    /**
                     * Greather than
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.less_than = function(str, max) {
                        if(!this.numeric(str)) {
                            return false;
                        }
                        return str < max;
                    }

                    /**
                     * Is a Natural number, but not a zero  (1,2,3, etc.)
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.is_natural = function(str) {
                        return (str.match(/^[0-9]+$/)?true:false);
                    }
                    
                    /**
                     * Valid Date
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.valid_date = function (str, date_format) {
                      //var date_separator = date_format.match(/[.,\/ -]/) ;
                        format = date_format || 'mm/dd/yyyy';
                    
                        var delimiter = /[^mdy]/.exec(format)[0]
                          , theFormat = format.split(delimiter)
                          , theDate = str.split(delimiter);
                    
                        function is_date(date, format) {
                    
                          var m, d, y;
                    
                          for (var i = 0, len = format.length; i < len; i++) {
                            if (/m/.test(format[i])) m = date[i];
                            if (/d/.test(format[i])) d = date[i];
                            if (/y/.test(format[i])) y = date[i];
                          }
                          if (!m || !d || !y) return false;
                    
                          return m > 0 && m < 13 &&
                            y && y.length == 4 &&
                            d > 0 && d <= (new Date(y, m, 0)).getDate();
                        }

                        return is_date(theDate, theFormat);
                    }

                    /**
                     * hexadecimal 
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.hexadecimal = function(str) {
                        return (str.match(/^[0-9a-fA-F]+$/)?true:false);
                    }

                    /**
                     * base64 string  
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.base64 = function(str) {
                        return (str.match(/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/)?true:false);
                    }

                    /**
                     * Valid IP Version 4  
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.valid_ip_v4 = function(str) {
                        return (str.match(/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/)?true:false);
                    }

                    /**
                     * Valid IP Version 6
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.valid_ip_v6 = function(str) {
                        return (str.match(/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/)?true:false);
                    }

                    /**
                     * Valid ascii
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.ascii = function(str) {
                        return (str.match(/^[\x00-\x7F]+$/)?true:false);
                    }

                    /**
                     * Valid multibyte 
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.multibyte = function(str) {
                        return (str.match(/[^\x00-\x7F]/)?true:false);
                    }

                    /**
                     * Surrogates and Supplementary Characters
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.surrogate_pair  = function(str) {
                        return (str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)?true:false);
                    }

                    /**
                     * hexcolor  
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.hexcolor = function(str) {
                        return (str.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)?true:false);
                    }

                    /**
                     * Valid Credit Card 
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.valid_credit_card = function(str) {
                        return (str.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)?true:false);
                    }
                    
                    /**
                     * Password
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.password  = function(str) {
                        return (str.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)?true:false);
                    }

                    /**
                     * Strong Password
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.strong_password  = function(str) {
                        return (str.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)?true:false);
                    }

                    /**
                     * Valid User name
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.username  = function(str) {
                        return (str.match(/^[a-z](?=[\w.]{3,31}$)\w*\.?\w*$/i)?true:false);
                    }

                    /**
                     * is null
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.is_null  = function(str) {
                        return str.length === 0;
                    }

                    /**
                     * is json
                     *
                     * @access	public
                     * @param	string
                     * @return	bool
                     */
                    this.is_json  = function(str) {
                        try {
                          JSON.parse(str);
                        } catch (e) {
                          return false;
                        }
                        return true;
                    }

                    /**
                     * Convert value to integer
                     *
                     * @access	public
                     * @param	string
                     * @return	int
                     */
                    this.to_int  = function(str) {
                        return parseInt(str);
                    }

                    /**
                     * Convert value to float
                     *
                     * @access	public
                     * @param	string
                     * @return	float
                     */
                    this.to_float  = function(str) {
                        return parseFloat(str);
                    }

                    /**
                     * Convert the string to lowercase letters
                     *
                     * @access	public
                     * @param	string
                     * @return	float
                     */
                    this.to_lower_case  = function(str) {
                        return str.toLowerCase();
                    }
                    
                    /**
                     * Convert the string to uppercase letters
                     *
                     * @access	public
                     * @param	string
                     * @return	float
                     */
                    this.to_upper_case  = function(str) {
                        return str.toUpperCase();
                    }

                    
                    this.run = function() {
                        $(this).submit (function() {return false;});
                        
                        $('input, select, textarea', this).each(function(i){
                            if (typeof($(this).attr('data-rules')) != 'undefined') {
                            self.clear_message();
                            
                               var rules =  $(this).attr('data-rules');
                               var rules_array = rules.split('|');
                               var data_error = $(this).attr('data-error'); 
                               var field_value = $(this).val();
                               
                               for(var i in rules_array) {
                                   var method = rules_array[i];
                                   if (method.indexOf('[') != -1) {
                                       var args = method.match(/\[(.*?)\]/g);
                                       args = args.toString();
                                       method = method.replace(args,'');
                                       args = self.trim(args);
                                       args = args.substr(1, args.length-2);
                                   } 
                                   if (typeof(self[method]) == 'undefined')  {
                                    console.log('Invalid Form validator  method ('+method+')!');
                                   } else {
                                    
                                      var _execute = null;
                                      if(typeof(args) != 'undefined') {
                                        _execute = eval("self."+method+"('"+field_value+"', '"+args+"')")
                                      } else {
                                        _execute = eval("self."+method+"('"+field_value+"')")
                                      }
                                       
                                      if(typeof(_execute) == 'string') {
                                        $(this).val(_execute);
                                      } else if (typeof(_execute) == 'boolean') {    
                                        if(!_execute) {
                                          self.can_submit = false;
                                          
                                          data_error = self.trim(data_error);
                                          if (data_error.length > 0) {
                                            var errors = self.parse_errors(data_error);
                                            if(typeof(errors[method]) != 'undefined') {
                                               self.set_message(errors[method]);
                                            } else {
                                              self.set_message('Error: Invalid '+method+' validation!');
                                            }
                                          }
                                        }
                                      } else {
                                         console.log('Undefined result....!');
                                      }
                                      
                                   }
                               }

                               //append message here
                               self.bind_message(this);
                            }
                        });
                        if(!self.can_submit) {
                          $(this).submit (function() {return false;});
                          $('html, body').animate({scrollTop:0}, 'slow');
                        } else {
                          $(this).unbind('submit').bind('submit').submit();
                        }
                        
                    }

                    this.run();    

              			if ( $.isFunction( settings.complete ) ) {
              				settings.complete.call(this);
              			}
                
                        return false;
		});

	};

}(jQuery));
 
 
 
