const handleThemeUpdate = (cssVars) => {
    const root = document.querySelector(':root');
    const keys = Object.keys(cssVars);
    keys.forEach(key => {
        root.style.setProperty(key, cssVars[key]);
    });
}

function dynamicPrimaryColor(primaryColor) {
    primaryColor.forEach((item) => {
        item.addEventListener('input', (e) => {
            const cssPropName = `--primary-jQuery{e.target.getAttribute('data-id')}`;
            const cssPropName1 = `--primary-jQuery{e.target.getAttribute('data-id1')}`;
            const cssPropName2 = `--primary-jQuery{e.target.getAttribute('data-id2')}`;
            const cssPropName7 = `--primary-jQuery{e.target.getAttribute('data-id7')}`;
            const cssPropName8 = `--darkprimary-jQuery{e.target.getAttribute('data-id8')}`;
            const cssPropName3 = `--dark-jQuery{e.target.getAttribute('data-id3')}`;
            const cssPropName4 = `--transparent-jQuery{e.target.getAttribute('data-id4')}`;
            const cssPropName5 = `--transparent-jQuery{e.target.getAttribute('data-id5')}`;
            const cssPropName6 = `--transparent-jQuery{e.target.getAttribute('data-id6')}`;
            const cssPropName9 = `--transparentprimary-jQuery{e.target.getAttribute('data-id9')}`;
            handleThemeUpdate({
                [cssPropName]: e.target.value,
                // 95 is used as the opacity 0.95  
                [cssPropName1]: e.target.value + 95,
                [cssPropName2]: e.target.value,
                [cssPropName3]: e.target.value,
                [cssPropName4]: e.target.value,
                [cssPropName5]: e.target.value,
                [cssPropName6]: e.target.value + 95,
                [cssPropName7]: e.target.value + 20,
                [cssPropName8]: e.target.value + 20,
                [cssPropName9]: e.target.value + 20,
            });
            jQuery("input.input-color-picker[data-id='bg-color']").val(cssPropName)
            jQuery("input.input-color-picker[data-id1='bg-hover']").val(cssPropName)
            jQuery("input.input-color-picker[data-id2='bg-border']").val(cssPropName)
            jQuery("input.input-color-picker[data-id7='transparentcolor']").val(cssPropName)
            jQuery("input.input-color-picker[data-id3='primary']").val(cssPropName8)
            jQuery("input.input-color-picker[data-id8='transparentcolor']").val(cssPropName8)
            jQuery("input.input-color-picker[data-id4='primary']").val(cssPropName4)
            jQuery("input.input-color-picker[data-id5='body']").val(cssPropName4)
            jQuery("input.input-color-picker[data-id6='theme']").val(cssPropName8)
            jQuery("input.input-color-picker[data-id9='transparentcolor']").val(cssPropName4)
        });
    });
}

(function() {
    // Light theme color picker
    // const LightThemeSwitchers = document.querySelectorAll('.light-mode .switch_section span');
    const dynamicPrimaryLight = document.querySelectorAll('input.color-primary-light');

    // themeSwitch(LightThemeSwitchers);
    dynamicPrimaryColor(dynamicPrimaryLight);

    // dark theme color picker

    // const DarkThemeSwitchers = document.querySelectorAll('.dark-mode .switch_section span')
    const DarkDynamicPrimaryLight = document.querySelectorAll('input.color-primary-dark');

    // themeSwitch(DarkThemeSwitchers);
    dynamicPrimaryColor(DarkDynamicPrimaryLight);

    // tranparent theme color picker

    // const transparentThemeSwitchers = document.querySelectorAll('.transparent-mode .switch_section span')
    const transparentDynamicPrimaryLight = document.querySelectorAll('input.color-primary-transparent');

    // themeSwitch(transparentThemeSwitchers);
    dynamicPrimaryColor(transparentDynamicPrimaryLight);

    // tranparent theme bgcolor picker

    // const transparentBgThemeSwitchers = document.querySelectorAll('.transparent-mode .switch_section span')
    const transparentDynamicPBgLight = document.querySelectorAll('input.color-bg-transparent');

    // themeSwitch(transparentBgThemeSwitchers);
    dynamicPrimaryColor(transparentDynamicPBgLight);

    localStorageBackup();

    jQuery('#myonoffswitch6').on('click', function(){
        document.querySelector('body')?.classList.remove('dark-mode');
        document.querySelector('body')?.classList.remove('transparent-mode');
        document.querySelector('body')?.classList.remove('bg-img1');
        document.querySelector('body')?.classList.remove('bg-img2');
        document.querySelector('body')?.classList.remove('bg-img3');
        document.querySelector('body')?.classList.remove('bg-img4');
        
        localStorage.removeItem('BgImage');
        jQuery('#myonoffswitch6').prop('checked', true);

        localStorage.setItem('lightMode', true);
        localStorage.removeItem('darkMode');
        localStorage.removeItem('transparentMode');
    })
    jQuery('#myonoffswitch7').on('click', function(){
    document.querySelector('body')?.classList.remove('light-mode');
    document.querySelector('body')?.classList.remove('transparent-mode');
    document.querySelector('body')?.classList.remove('bg-img1');
    document.querySelector('body')?.classList.remove('bg-img2');
    document.querySelector('body')?.classList.remove('bg-img3');
    document.querySelector('body')?.classList.remove('bg-img4');
    
    localStorage.removeItem('BgImage');
    jQuery('#myonoffswitch7').prop('checked', true);
    
    localStorage.setItem('darkMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('transparentMode');
    })
    jQuery('#myonoffswitchTransparent').on('click', function(){
    document.querySelector('body')?.classList.remove('dark-mode');
    document.querySelector('body')?.classList.remove('light-mode');
    document.querySelector('body')?.classList.remove('bg-img1');
    document.querySelector('body')?.classList.remove('bg-img2');
    document.querySelector('body')?.classList.remove('bg-img3');
    document.querySelector('body')?.classList.remove('bg-img4');
    
    localStorage.removeItem('BgImage');
    jQuery('#myonoffswitchTransparent').prop('checked', true);
    
    localStorage.setItem('transparentMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('darkMode');
    })
        
})();

function localStorageBackup() {
    // if there is a value stored, update color picker and background color
    // Used to retrive the data from local storage
    if (localStorage.primaryColor) {
        // document.getElementById('colorID').value = localStorage.primaryColor;
        document.querySelector('html').style.setProperty('--primary-bg-color', localStorage.primaryColor);
        document.querySelector('html').style.setProperty('--primary-bg-hover', localStorage.primaryHoverColor);
        document.querySelector('html').style.setProperty('--primary-bg-border', localStorage.primaryBorderColor);
        document.querySelector('html').style.setProperty('--primary-transparentcolor', localStorage.primaryTransparent);
		document.querySelector('body')?.classList.add('light-mode');
		document.querySelector('body')?.classList.remove('dark-mode');
		document.querySelector('body')?.classList.remove('transparent-mode');

        jQuery('#myonoffswitch8').prop('checked', true);
        jQuery('#myonoffswitch12').prop('checked', true);
    }

    if (localStorage.darkPrimary) {
        // document.getElementById('darkPrimaryColorID').value = localStorage.darkPrimary;
        document.querySelector('html').style.setProperty('--primary-bg-color', localStorage.darkPrimary);
        document.querySelector('html').style.setProperty('--primary-bg-hover', localStorage.darkPrimary);
        document.querySelector('html').style.setProperty('--primary-bg-border', localStorage.darkPrimary);
        document.querySelector('html').style.setProperty('--dark-primary', localStorage.darkPrimary);
        document.querySelector('html').style.setProperty('--darkprimary-transparentcolor', localStorage.darkprimaryTransparent);
		document.querySelector('body')?.classList.add('dark-mode');
		document.querySelector('body')?.classList.remove('light-mode');
		document.querySelector('body')?.classList.remove('transparent-mode');

        jQuery('#myonoffswitch7').prop('checked', true);

    }


    if (localStorage.transparentPrimary) {
        // document.getElementById('transparentPrimaryColorID').value = localStorage.transparentPrimary;
        document.querySelector('html').style.setProperty('--primary-bg-color', localStorage.transparentPrimary);
        document.querySelector('html').style.setProperty('--primary-bg-hover', localStorage.transparentPrimary);
        document.querySelector('html').style.setProperty('--primary-bg-border', localStorage.transparentPrimary);
        document.querySelector('html').style.setProperty('--transparent-primary', localStorage.transparentPrimary);
        document.querySelector('html').style.setProperty('--transparentprimary-transparentcolor', localStorage.transparentprimaryTransparent);
		document.querySelector('body')?.classList.add('transparent-mode');
		document.querySelector('body')?.classList.remove('dark-mode');
		document.querySelector('body')?.classList.remove('light-mode');

        jQuery('#myonoffswitchTransparent').prop('checked', true);
    }

    if (localStorage.transparentBgImgPrimary) {
		// document.getElementById('transparentBgImgPrimaryColorID').value = localStorage.transparentBgImgPrimary;
		document.querySelector('html').style.setProperty('--primary-bg-color', localStorage.transparentBgImgPrimary);
		document.querySelector('html').style.setProperty('--primary-bg-hover', localStorage.transparentBgImgPrimary);
		document.querySelector('html').style.setProperty('--primary-bg-border', localStorage.transparentBgImgPrimary);
		document.querySelector('html').style.setProperty('--transparent-primary', localStorage.transparentBgImgPrimary);
		document.querySelector('html').style.setProperty('--transparentprimary-transparentcolor', localStorage.transparentBgImgprimaryTransparent);
		document.querySelector('body')?.classList.add('transparent-mode');
		document.querySelector('body')?.classList.remove('dark-mode');
		document.querySelector('body')?.classList.remove('light-mode');
		
		jQuery('#myonoffswitchTransparent').prop('checked', true);
	}
    
    if (localStorage.transparentBgColor) {
        // document.getElementById('transparentBgColorID').value = localStorage.transparentBgColor;
        document.querySelector('html').style.setProperty('--transparent-body', localStorage.transparentBgColor);
        document.querySelector('html').style.setProperty('--transparent-mode', localStorage.transparentThemeColor);
        document.querySelector('html').style.setProperty('--transparentprimary-transparentcolor', localStorage.transparentprimaryTransparent);
        document.querySelector('body').classList.add('transparent-mode');
        document.querySelector('body').classList.remove('dark-mode');
        document.querySelector('body').classList.remove('light-mode');


        jQuery('#myonoffswitchTransparent').prop('checked', true);
    }
	if (localStorage.BgImage) {
		document.querySelector('body')?.classList.add('transparent-mode');
        let bgImg = localStorage.BgImage.split(' ')[0];
		document.querySelector('body')?.classList.add(bgImg);
		document.querySelector('body')?.classList.remove('dark-mode');
		document.querySelector('body')?.classList.remove('light-mode');
		
		jQuery('#myonoffswitchTransparent').prop('checked', true);
	}

    if(localStorage.lightMode){
        document.querySelector('body')?.classList.add('light-mode');
		document.querySelector('body')?.classList.remove('dark-mode');
		document.querySelector('body')?.classList.remove('transparent-mode');
        jQuery('#myonoffswitch6').prop('checked', true);
        jQuery('#myonoffswitch8').prop('checked', true);
        jQuery('#myonoffswitch12').prop('checked', true);
    }
    if(localStorage.darkMode){
        document.querySelector('body')?.classList.remove('light-mode');
		document.querySelector('body')?.classList.add('dark-mode');
		document.querySelector('body')?.classList.remove('transparent-mode');
        jQuery('#myonoffswitch7').prop('checked', true);

        jQuery('#myonoffswitch10').prop('checked', true);
        jQuery('#myonoffswitch14').prop('checked', true);
    }
    if(localStorage.transparentMode){
        document.querySelector('body')?.classList.remove('light-mode');
		document.querySelector('body')?.classList.remove('dark-mode');
		document.querySelector('body')?.classList.add('transparent-mode');
        jQuery('#myonoffswitchTransparent').prop('checked', true);
        jQuery('#myonoffswitch8').prop('checked', false);
        jQuery('#myonoffswitch10').prop('checked', false);
        jQuery('#myonoffswitch12').prop('checked', false);
        jQuery('#myonoffswitch14').prop('checked', false);
    }
}

// triggers on changing the color picker
function changePrimaryColor() {
    
    var userColor = document.getElementById('colorID').value;
    localStorage.setItem('primaryColor', userColor);
    // to store value as opacity 0.95 we use 95
    localStorage.setItem('primaryHoverColor', userColor + 95);
    localStorage.setItem('primaryBorderColor', userColor);
    localStorage.setItem('primaryTransparent', userColor + 20);
    
    // removing dark theme properties
    localStorage.removeItem('darkPrimary')
    localStorage.removeItem('transparentBgColor');
    localStorage.removeItem('transparentThemeColor');
    localStorage.removeItem('transparentPrimary');
    localStorage.removeItem('transparentBgImgPrimary');
	localStorage.removeItem('transparentBgImgprimaryTransparent');
    localStorage.removeItem('darkprimaryTransparent');
    document.querySelector('body').classList.add('light-mode');
    document.querySelector('body').classList.remove('transparent-mode');
    document.querySelector('body').classList.remove('dark-mode');
	localStorage.removeItem('BgImage');
    
    jQuery('#myonoffswitch8').prop('checked', true);
    jQuery('#myonoffswitch12').prop('checked', true);
    jQuery('#myonoffswitch12').prop('checked', true);
    checkOptions();
    names()

    
    localStorage.setItem('lightMode', true);
    localStorage.removeItem('darkMode');
    localStorage.removeItem('transparentMode');
}

function darkPrimaryColor() {

    var userColor = document.getElementById('darkPrimaryColorID').value;
    localStorage.setItem('darkPrimary', userColor);
    localStorage.setItem('darkprimaryTransparent', userColor + 20);
    jQuery('#myonoffswitch10').prop('checked', true);
    jQuery('#myonoffswitch14').prop('checked', true);
    checkOptions();

    // removing light theme data 
    localStorage.removeItem('primaryColor')
    localStorage.removeItem('primaryHoverColor')
    localStorage.removeItem('primaryBorderColor')
    localStorage.removeItem('primaryTransparent');
    localStorage.removeItem('transparentBgImgPrimary');
	localStorage.removeItem('transparentBgImgprimaryTransparent');

    localStorage.removeItem('transparentBgColor');
    localStorage.removeItem('transparentThemeColor');
    localStorage.removeItem('transparentPrimary');
	localStorage.removeItem('BgImage');

    document.querySelector('body').classList.add('dark-mode');
    document.querySelector('body').classList.remove('light-mode');
    document.querySelector('body').classList.remove('transparent-mode');

    jQuery('#myonoffswitch7').prop('checked', true);
    names()
    
    localStorage.setItem('darkMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('transparentMode');
}

function transparentPrimaryColor() {
    jQuery('#myonoffswitch12').prop('checked', false);
    jQuery('#myonoffswitch13').prop('checked', false);
    jQuery('#myonoffswitch14').prop('checked', false);
    jQuery('#myonoffswitch15').prop('checked', false);

    var userColor = document.getElementById('transparentPrimaryColorID').value;
    localStorage.setItem('transparentPrimary', userColor);
    localStorage.setItem('transparentprimaryTransparent', userColor + 20);

    // removing light theme data 
    localStorage.removeItem('darkPrimary');
    localStorage.removeItem('primaryColor')
    localStorage.removeItem('primaryHoverColor')
    localStorage.removeItem('primaryBorderColor')
    localStorage.removeItem('primaryTransparent');
    localStorage.removeItem('transparentBgImgPrimary');
	localStorage.removeItem('transparentBgImgprimaryTransparent');
    document.querySelector('body').classList.add('transparent-mode');
    document.querySelector('body').classList.remove('light-mode');
    document.querySelector('body').classList.remove('dark-mode');
	document.querySelector('body')?.classList.remove('bg-img1');
	document.querySelector('body')?.classList.remove('bg-img2');
	document.querySelector('body')?.classList.remove('bg-img3');
	document.querySelector('body')?.classList.remove('bg-img4');

    jQuery('#myonoffswitchTransparent').prop('checked', true);
    checkOptions();
    names()
    
    localStorage.setItem('transparentMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('darkMode');
}

function transparentBgImgPrimaryColor() {
    jQuery('#myonoffswitch12').prop('checked', false);
    jQuery('#myonoffswitch13').prop('checked', false);
    jQuery('#myonoffswitch14').prop('checked', false);
    jQuery('#myonoffswitch15').prop('checked', false);
	var userColor = document.getElementById('transparentBgImgPrimaryColorID').value;
	localStorage.setItem('transparentBgImgPrimary', userColor);
	localStorage.setItem('transparentBgImgprimaryTransparent', userColor+20);
	if(
		document.querySelector('body')?.classList.contains('bg-img1') == false &&
		document.querySelector('body')?.classList.contains('bg-img2') == false &&
		document.querySelector('body')?.classList.contains('bg-img3') == false &&
		document.querySelector('body')?.classList.contains('bg-img4') == false
		){
		document.querySelector('body')?.classList.add('bg-img1');
        localStorage.setItem('BgImage', 'bg-img1')
	}
    // removing light theme data 
	localStorage.removeItem('darkPrimary');
	localStorage.removeItem('primaryColor')
	localStorage.removeItem('primaryHoverColor')
	localStorage.removeItem('primaryBorderColor')
	localStorage.removeItem('primaryTransparent');
	localStorage.removeItem('darkprimaryTransparent');
	localStorage.removeItem('transparentPrimary')
	localStorage.removeItem('transparentprimaryTransparent');
	document.querySelector('body').classList.add('transparent-mode');
	document.querySelector('body')?.classList.remove('light-mode');
	document.querySelector('body')?.classList.remove('dark-mode');

	jQuery('#myonoffswitchTransparent').prop('checked', true);
    checkOptions();
	names();
    
    localStorage.setItem('transparentMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('darkMode');
}


function transparentBgColor() {
    jQuery('#myonoffswitch12').prop('checked', false);
    jQuery('#myonoffswitch13').prop('checked', false);
    jQuery('#myonoffswitch14').prop('checked', false);
    jQuery('#myonoffswitch15').prop('checked', false);
    var userColor = document.getElementById('transparentBgColorID').value;
    localStorage.setItem('transparentBgColor', userColor);
    localStorage.setItem('transparentThemeColor', userColor + 95);
    localStorage.setItem('transparentprimaryTransparent', userColor + 20);
    localStorage.removeItem('transparentBgImgPrimary');
	localStorage.removeItem('transparentBgImgprimaryTransparent');

    // removing light theme data 
    localStorage.removeItem('darkPrimary');
    localStorage.removeItem('primaryColor')
    localStorage.removeItem('primaryHoverColor')
    localStorage.removeItem('primaryBorderColor')
    localStorage.removeItem('primaryTransparent');
	localStorage.removeItem('BgImage');
    document.querySelector('body').classList.add('transparent-mode');
    document.querySelector('body').classList.remove('light-mode');
    document.querySelector('body').classList.remove('dark-mode');
	document.querySelector('body')?.classList.remove('bg-img1');
	document.querySelector('body')?.classList.remove('bg-img2');
	document.querySelector('body')?.classList.remove('bg-img3');
	document.querySelector('body')?.classList.remove('bg-img4');

    jQuery('#myonoffswitchTransparent').prop('checked', true);
    checkOptions();
    
    localStorage.setItem('transparentMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('darkMode');
}


function bgImage(e) {

    jQuery('#myonoffswitch12').prop('checked', false);
    jQuery('#myonoffswitch13').prop('checked', false);
    jQuery('#myonoffswitch14').prop('checked', false);
    jQuery('#myonoffswitch15').prop('checked', false);
	let imgID = e.getAttribute('class');
	localStorage.setItem('BgImage', imgID);
    
    // removing light theme data 
	localStorage.removeItem('darkPrimary');
	localStorage.removeItem('primaryColor')
	localStorage.removeItem('transparentBgColor');
	localStorage.removeItem('transparentThemeColor');
	localStorage.removeItem('transparentprimaryTransparent');
	document.querySelector('body').classList.add('transparent-mode');
	document.querySelector('body')?.classList.remove('light-mode');
	document.querySelector('body')?.classList.remove('dark-mode');

	jQuery('#myonoffswitchTransparent').prop('checked', true);
    checkOptions();
    
    localStorage.setItem('transparentMode', true);
    localStorage.removeItem('lightMode');
    localStorage.removeItem('darkMode');
}

// to check the value is hexa or not
const isValidHex = (hexValue) => /^#([A-Fa-f0-9]{3,4}){1,2}jQuery/.test(hexValue)

const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{jQuery{chunkSize}}`, "g"))
    // convert hex value to 256
const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16)
    // get alpha value is equla to 1 if there was no value is asigned to alpha in function
const getAlphafloat = (a, alpha) => {
        if (typeof a !== "undefined") { return a / 255 }
        if ((typeof alpha != "number") || alpha < 0 || alpha > 1) {
            return 1
        }
        return alpha
    }
    // convertion of hex code to rgba code 
function hexToRgba(hexValue, alpha) {
    if (!isValidHex(hexValue)) { return null }
    const chunkSize = Math.floor((hexValue.length - 1) / 3)
    const hexArr = getChunksFromString(hexValue.slice(1), chunkSize)
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
    return `rgba(jQuery{r}, jQuery{g}, jQuery{b}, jQuery{getAlphafloat(a, alpha)})`
}


let myVarVal, myVarVal1, myVarVal2, myVarVal3

function names() {

    let primaryColorVal = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg-color').trim();

    //get variable
    myVarVal = localStorage.getItem("primaryColor") || localStorage.getItem("darkPrimary") || localStorage.getItem("transparentPrimary") || localStorage.getItem("transparentBgImgPrimary")  || primaryColorVal;
    myVarVal1 = localStorage.getItem("primaryColor") || localStorage.getItem("darkPrimary") || localStorage.getItem("transparentPrimary") || localStorage.getItem("transparentBgImgPrimary")  || "#05c3fb";
    myVarVal2 = localStorage.getItem("primaryColor") || localStorage.getItem("darkPrimary") || localStorage.getItem("transparentPrimary") || localStorage.getItem("transparentBgImgPrimary")  || null;
    myVarVal3 = localStorage.getItem("primaryColor") || localStorage.getItem("darkPrimary") || localStorage.getItem("transparentPrimary") || localStorage.getItem("transparentBgImgPrimary") || null;

    if(document.querySelector('#chartArea') !== null){
        chartArea();
    }

    if(document.querySelector('#recentorders') !== null){
        recentOrders();
    }
    
    let colorData = hexToRgba(myVarVal || "#6259ca", 0.1)
    document.querySelector('html').style.setProperty('--primary01', colorData);

    let colorData1 = hexToRgba(myVarVal || "#6259ca", 0.2)
    document.querySelector('html').style.setProperty('--primary02', colorData1);

    let colorData2 = hexToRgba(myVarVal || "#6259ca", 0.3)
    document.querySelector('html').style.setProperty('--primary03', colorData2);

    let colorData3 = hexToRgba(myVarVal || "#6259ca", 0.6)
    document.querySelector('html').style.setProperty('--primary06', colorData3);

    let colorData4 = hexToRgba(myVarVal || "#6259ca", 0.9)
    document.querySelector('html').style.setProperty('--primary09', colorData4);

}
names()

