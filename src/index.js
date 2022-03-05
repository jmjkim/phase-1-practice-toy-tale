let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  
  const url = 'http://localhost:3000/toys';
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  function fetchObject(callback) {
    // uses default GET method for requesting data from provided URL, receives response and converts to JSON format.
    fetch(url)
      .then(response => response.json())
      .then(callback)
      .catch(error => console.log(error));
  }


  function createCards(data) {
    // Add 'card' as a class name to each created div and appends to div container(div#toy-collection) as a child element.
    data.forEach(toyObject => {
      const div = document.createElement('div');
      div.setAttribute('class', 'card');
      document.querySelector('div#toy-collection').appendChild(div);

      createHTMLTags(toyObject, div);
    });

    addLikeListener(data);
  }

  function addLikeListener(data) {
    const btn = document.querySelectorAll('button.like-btn');

    btn.forEach(button => button.addEventListener('click', (e) => {
      data.forEach(toyObject => {
        if (e.target.id === toyObject.id.toString()) {
          let newNumberOfLike = toyObject.likes += 1;

          fetch(url + `/${e.target.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              'p': newNumberOfLike,
              'likes': newNumberOfLike
            })
          })
          .then(response => response.json()) 
          .then(document.querySelector(`#p-${e.target.id}`).innerText = newNumberOfLike)
          .then(data => console.log(data));
        }
      });
    }));
  }


  function createHTMLTags(data, appendTo) {
    // creates HTML tag and then add values inside using the data that was parsed from fetchObject function.
    let tagObject = {
      'h2': data.name,
      'img': data.image,
      'p': data.likes,
      'button': data.id
    }

    for ([key, value] of Object.entries(tagObject)) {
      let tags = document.createElement(key);
      tags.innerText = value;

      if (key === 'img') {
        tags.setAttribute('src', data.image);
        tags.setAttribute('class', 'toy-avatar');
        tags.innerText = '';
      }
      if (key === 'button') {
        tags.setAttribute('class', 'like-btn');
        tags.setAttribute('id', data.id);
        tags.innerText = 'Like ❤️';
      }
      if (key === 'p') {
        tags.setAttribute('id', `p-${data.id}`);
      }
      appendTo.append(tags);
    }
  }


  function addNewToy() {
    const form = document.querySelector('form.add-toy-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let toyName = document.querySelector('input[name=name]').value;
      let toyImageUrl = document.querySelector('input[name=image]').value;
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          'name': toyName,
          'image': toyImageUrl,
          'likes': 0
        })
      })
      .then(response => response.json())
      .then(data => {
        const div = document.createElement('div');
        div.setAttribute('class', 'card');
        document.querySelector('div#toy-collection').appendChild(div);

        createHTMLTags(data, div);
        addLikeListener([data]);
        console.log(data);
      })
    })
  }


// function list 
  fetchObject(createCards);
  addNewToy();
});