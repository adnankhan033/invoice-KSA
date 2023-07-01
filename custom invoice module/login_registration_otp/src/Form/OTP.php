<?php
namespace Drupal\login_registration_otp\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\AlertCommand;
/**
 * Class OTP.
 */
class OTP extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'o_t_p';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
         global $base_url;
        //$otp = $num = str_pad(mt_rand(1,9999),4,'0',STR_PAD_LEFT);

        $session = \Drupal::request()->getSession();
        $otp = $session->get('otp');

        $form['digit'] = array(
            '#markup' => '<span class="">'.t("your current OTP 1234. </ br> Please enter 4 digit code we sent on registered Email and Phone Number").'</span>',
            '#title' => t("Confirmation"),
            '#description' => '',
            '#prefix' => '<div class="row"><div class="col-sm-12 col-xs-12">',
            '#suffix' => '</div></div>',
        );
        $form['field_otp'] = array(
            '#type' => 'password',
            '#title' => t('Enter Code'),
            '#maxlength' => 4,
            '#attributes' =>array('placeholder' => t('****')),
        );

        $form['submit'] = array(
            '#value' => t('Verify'),
            '#type' => 'submit',
            '#attributes' => array('class' => array('submit')),

        );

        $form['msg-wrapper'] =[
            '#markup'=>'<div id="msg-div"></div>'
        ];


        $form['resend_otp'] = array(
            '#type' => 'button',
            '#value' => t('Click Here'),
            '#ajax' => array(
                'callback' => '::event_resend_otp',
                'event' => 'click',
                'wrapper' => 'msg-div',
                'method' => 'replace',
                'effect' => 'fade',
            ),
            '#prefix' => '<div class="resend-otp">Resend Code', 
            '#suffix' => '</div>',
        );

        return $form;
  }
    public function submitForm(array &$form, FormStateInterface $form_state) {
      

        
        global $base_url;
        $base_url_parts = parse_url($base_url);
        $site_base_url = implode('/', $base_url_parts);
        $session = \Drupal::request()->getSession();
        $otpsession_val = $session->get('otp');
        $cuid = $session->get('uid');
        $login_id = $session->get('login-id');
        $otp_value = $form['field_otp']['#value'];
        //        kint($session); exit;
        if($otp_value == $otpsession_val){
            if(isset($login_id)) {
                $user = User::load($login_id);
                user_login_finalize($user);
                $response = new RedirectResponse("../user/$cuid");
                $response->send();
            }
        }else{
            $messenger = \Drupal::service('messenger');
            $messenger->addError(t('Invalid OTP.'));

        }
        //echo "<pre>"; print_r($otp_value);print_r($otpsession_val);exit;


    }
    public function event_resend_otp(array &$form, FormStateInterface $form_state){
        global $user;
        $otp = str_pad(mt_rand(1,9999),4,'0',STR_PAD_LEFT);
        $session = \Drupal::request()->getSession();
        /**** SET SESSION ****/
        $session->set('otp', 1234);
        $session_name = $session->get('session-name');
        $session_email = $session->get('login-email');

        $arr = array('name' => $session_name, 'email' => $session_email, 'otp' => $otp);
        //sendEmail($name,$email,$otp);
        sendEmail($arr, 'user_login_opt');

        $output = [];
        $output['reSentOTP'] = ['#markup'=>"<span class='otp-resend'>OTP has been sent Successfully.  $otp</span>"];
        return $output;	
        $ajax_response = new AjaxResponse();
        return $ajax_response;
    }

}
