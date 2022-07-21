function validateForm() {
    let x = document.forms["myForm"]["name"].value;
     var $name = document.getElementById("name").value;
    var $phone = document.getElementById("phone").value;
    var $email = document.getElementById("email").value;
    var $comments = document.getElementById("comments").value;

    console.log("form check");
    var letters = /^[A-Za-z]+$/;
    var numbers = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var text ="";

    if(!$name.match(letters) ){
        alert('Please give a valid name');
        return false;
    }
    else if($phone.length != 10 || !$phone.match(numbers)){
        alert('Please give a valid number');
        return false;
    }
    else if($email.indexOf("@") == -1 || $email.length < 6 || !$email.match(mailformat)){        
        alert('Please give a valid Email');
        return false;
    }
    else if($comments===''){
        alert('Please enter comments');
        return false;
    }


    
    alert('Thank you for your feedback');
    res.redirect('');
    return true;
 
  }