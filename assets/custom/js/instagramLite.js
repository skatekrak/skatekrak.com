/*!

Name: Instagram Lite
Dependencies: jQuery
Author: Michael Lynch
Author URL: http://michaelynch.com
Date Created: January 14, 2014
Licensed under the MIT license

*/

;(function($) {

    $.fn.instagramLite = function(options) {
    
    	// return if no element was bound
		// so chained events can continue
		if(!this.length) { 
			return this; 
		}
        
        // define plugin
        plugin = this;
        
        // define default parameters
        plugin.defaults = {
            username: null,
            clientID: null,
            limit: null,
            list: true,
            videos: false,
            urls: false,
            captions: false,
            date: false,
            likes: false,
            comments_count: false,
            max_id: null,
            load_more: null,
            error: function() {},
            success: function() {}
        }
        
        // vars
        var s = $.extend({}, plugin.defaults, options),
        	el = $(this);

        var getMaxId = function(items) {
	    
	    	// return id of last item
	    	return items[items.length-1].id;
	    };
	    
	    var formatCaption = function(caption) {
	    
	    	var words = caption.split(' '),
	    		newCaption = '';
	    	
	    	for(var i = 0; i < words.length; i++) {
	    		
	    		var word;
		    	
		    	if(words[i][0] == '@') {
			    	var a = '<a href="http://twitter.com/'+words[i].replace('@', '').toLowerCase()+'" target="_blank">'+words[i]+'</a>';
			    	word = a;
			    } else if(words[i][0] == '#') {
			    	var a = '<a href="http://twitter.com/hashtag/'+words[i].replace('#', '').toLowerCase()+'" target="_blank">'+words[i]+'</a>';
			    	word = a;
		    	} else {
			    	word = words[i]
		    	}
	
		    	newCaption += word + ' ';
	    	}
	    
	    	return newCaption;
		    
	    };
	    
	    var loadContent = function() {
	
	    	// if client ID and username were provided
	        if(s.clientID && s.username) {
	        
		        // for each element
		        el.each(function() {
		        
		        	var el = $(this);
		        
		        	// search the user
		        	// to get user ID
		        	$.ajax({
			        	type: 'GET',
			        	url: 'https://api.instagram.com/v1/users/search?q='+s.username+'&client_id='+s.clientID+'&callback=?',
			        	dataType: 'jsonp',
			        	success: function(data) {
		
			        		if(data.data.length) {
				        		
			        			// define user namespace
				        		var thisUser = data.data[0];
				        		
			        			// construct API endpoint
								var url = 'https://api.instagram.com/v1/users/'+thisUser.id+'/media/recent/?client_id='+s.clientID+'&count='+s.limit+'&callback=?';
								
								// concat max id if max id is set
								url += (s.max_id) ? '&max_id='+s.max_id : '';
			
			        			$.ajax({
						        	type: 'GET',
						        	url: url,
						        	dataType: 'jsonp',
						        	success: function(data) {
						        		
						        		// if success status
						        		if(data.meta.code === 200 && data.data.length) {
											
							        		// for each piece of media returned
							        		for(var i = 0; i < data.data.length; i++) {
							        		
							        			// define media namespace
							        			var thisMedia = data.data[i],
							        				item;
							        			
							        			// if media type is image or videos is set to false
							        			if(thisMedia.type === 'image' || !s.videos) {
							        			
								        			// construct image
								        			item = '<img class="il-photo__img" src="'+thisMedia.images.standard_resolution.url+'" alt="Instagram Image" data-filter="'+thisMedia.filter+'" />';

								        			// if url setting is true
								        			if(s.urls) {
								        			
								        				item = '<a href="'+thisMedia.link+'" target="_blank">'+item+'</a>';
									        			
								        			}
								        			
								        			if(s.captions || s.date || s.likes || s.comments_count) {
									        			item += '<div class="il-photo__meta">';
								        			}
								        			
								        			// if caption setting is true
								        			if(s.captions && thisMedia.caption) {
								        			
								        				item += '<div class="il-photo__caption" data-caption-id="'+thisMedia.caption.id+'">'+formatCaption(thisMedia.caption.text)+'</div>';
									        			
								        			}
								        			
								        			// if date setting is true
								        			if(s.date) {
								        			
								        				var date = new Date(thisMedia.created_time * 1000),
								        					day = date.getDate(),
															month = date.getMonth() + 1,
															year = date.getFullYear(),
															hours = date.getHours(),
															minutes = date.getMinutes(),
															seconds = date.getSeconds();
															
														date = month +'/'+ day +'/'+ year;
								        			
								        				item += '<div class="il-photo__date">'+date+'</div>';
									        			
								        			}
								        			
								        			// if likes setting is true
								        			if(s.likes) {
								        			
								        				item += '<div class="il-photo__likes">'+thisMedia.likes.count+'</div>';
									        			
								        			}
								        			
								        			// if caption setting is true
								        			if(s.comments_count && thisMedia.comments) {
								        			
								        				item += '<div class="il-photo__comments">'+thisMedia.comments.count+'</div>';
									        			
								        			}
								        			
								        			if(s.captions || s.date || s.likes || s.comments_count) {
									        			item += '</div>';
								        			}

							        			}
							        			
							        			if(thisMedia.type === 'video' && s.videos) {
							        				
							        				if(thisMedia.videos) {
							        				
							        					var src;
							        				
							        					if(thisMedia.videos.standard_resolution) {
							        					
							        						src = thisMedia.videos.standard_resolution.url;
								        					
							        					} else if(thisMedia.videos.low_resolution) {
							        					
							        						src = thisMedia.videos.low_resolution.url;
								        					
							        					} else if(thisMedia.videos.low_bandwidth) {
							        					
							        						src = thisMedia.videos.low_bandwidth.url;
								        					
							        					}
							        					
							        					item = '<video poster="'+thisMedia.images.standard_resolution.url+'" controls>';
							        					
							        					item += '<source src="'+src+'" type="video/mp4;"></source>';
							        					
							        					item += '</video>';
								        				
							        				}
							        			}
							        			
							        			// if list setting is true
							        			if(s.list && item) {
							        			
							        				// redefine item with wrapping list item
							        				item = '<li class="il-item" data-instagram-id="'+thisMedia.id+'">'+item+'</li>';
							        			}

							        			// append image / video
							        			if(item !== '') {
							        				el.append(item);
							        			}
							        		}
							        		
							        		// set new max id
							        		s.max_id = getMaxId(data.data);
							        		
							        		// execute success callback
							        		s.success.call(this);
						        		
						        		} else {
							        		
							        		// execute error callback
							        		s.error.call(this, data.meta.code, data.meta.error_message);
							        		
						        		}
						        	
						        	},
						        	error: function() {
						        	
						        		// recent media ajax request failed
						        		// execute error callback
						        		s.error.call(this);
						        	}
						        });
	
			        		} else {
			        		
			        			// error finding username
			        			// execute error callback
								s.error.call(this);
				        		
			        		}
			        	},
			        	error: function() {
			        	
			        		// search username ajax request failed
			        		// execute error callback
							s.error.call(this);
				        	
			        	}
		        	});
		        
		        });
	        
	        } else {
	        
	        	// username or client ID were not provided
			    // execute error callback
				s.error.call(this);
	        };
	    }
	    
	    // bind load more click event
        if(s.load_more){
        	$(s.load_more).on('click', function(e) {
	        	e.preventDefault();
	        	loadContent();
	        });
        }
	    
	    // init
        loadContent(); 
    }
    
})(jQuery);