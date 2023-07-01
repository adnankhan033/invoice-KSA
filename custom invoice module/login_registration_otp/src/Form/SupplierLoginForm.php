<?php

namespace Drupal\login_registration_otp\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Ajax\Response;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\AlertCommand;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Ajax\RedirectCommand;

/**
 * Class SupplierLoginForm.
 */
class SupplierLoginForm extends FormBase {

    /**
   * {@inheritdoc}
   */
    public function getFormId() {
        return 'supplier_login_form';
    }

    /**
   * {@inheritdoc}
   */
    public function buildForm(array $form, FormStateInterface $form_state) {

        $form['phone_number'] = [
            '#type' => 'tel',
            '#title' => $this->t('Phone Number'),
            '#required' => TRUE,
            '#default_value' => "+966515656563",
            '#weight' => '0',
        ];

        $form['actions']['submit'] = [
            '#type' => 'submit',
            '#value' => $this->t('Send OTP'),
            '#ajax' => [
                'callback' => '::ajaxCallSendOTP',
                'wrapper' => 'custom-form-result',
                'effect' => 'fade',
            ],
        ];

        $form['result'] = [
            '#type' => 'markup',
            '#prefix' => '<div id="custom-form-result">',
            '#suffix' => '</div>',
            '#markup' => '',
        ];



        // Add OTP field.
        $form['otp'] = [
            '#type' => 'textfield',
            '#title' => t('OTP'),
            '#required' => TRUE,
            '#maxlength' => 4,
            '#attributes' => ['placeholder' => t('****')],
            '#states' => [
                'visible' => [
                    ':input[name="otp_verification"]' => ['checked' => TRUE],
                ],
            ],
        ];


        // Add OTP verification checkbox.
        $form['otp_verification'] = [            
            '#type' => 'submit',
            '#value' => t('Verify OTP'),

            '#ajax' => [
                'callback' => '::invoice_otp_verification_callback',
                'wrapper' => 'custom-form-result',
                'effect' => 'fade',
            ],
        ];

        return $form;

    }




    /**
   * AJAX callback to display the entered phone number.
   */
    public function ajaxCallSendOTP(array &$form, FormStateInterface $form_state) {
        $response = new AjaxResponse();

        // Get the entered phone number from the form state.
        $phone_number = $form_state->getValue('phone_number');

        $load_user = \Drupal::entityTypeManager()
            ->getStorage('user')
            ->loadByProperties(['field_phone' => $phone_number]);

        if (!empty($load_user)) {
            $otp = $num = str_pad(rand(0,9999),4,'0',STR_PAD_LEFT);
            $session = \Drupal::request()->getSession();
            //    /**** SET SESSION ****/
            $session->set('otp', $otp);
            $session = \Drupal::request()->getSession();
            $session_otp = $session->get('otp');
            $response->addCommand(new HtmlCommand('#custom-form-result', "set new opt $session_otp"));

        }
        else {
            // User not found
            $response->addCommand(new HtmlCommand('#custom-form-result', "User not found"));
        }

        return $response;
    }

    /**
 * Ajax callback for OTP verification.
 */
    public function invoice_otp_verification_callback(array &$form, FormStateInterface $form_state) {
        $response = new AjaxResponse();

        $verified = FALSE;
        // Implement your OTP verification logic here.
        $submitted_otp = $form_state->getValue('otp');
        $session = \Drupal::request()->getSession();
        $otpsession_val = $session->get('otp');

        $mobile_number = $form_state->getValue("phone_number");

        // Example logic: Compare submitted OTP with a predefined value (e.g., "1234").
        if ($submitted_otp ==$otpsession_val) {
            $verified = TRUE;
        }

        // Enable or disable the main submit button based on OTP verification.
        if ($verified) {
            $response->addCommand(new HtmlCommand('#custom-form-result', "match otp"));
            //            $response->addCommand(new AlertCommand("correct"));
            $phone_number = $form_state->getValue('phone_number');

            $load_user = \Drupal::entityTypeManager()
                ->getStorage('user')
                ->loadByProperties(['field_phone' => $phone_number]);
            $user_id = NULL;
            if (!empty($load_user)) {
                $user = reset($load_user);
                $user_id = $user->id();
                \Drupal::currentUser()->setAccount($user);
                // Log in the user
                user_login_finalize($user);
                $redirect_url = "../user/$user_id";
                $response->addCommand(new RedirectCommand($redirect_url));

            }


        } else {
            //            $response->addCommand(new AlertCommand("Invalid"));
            $response->addCommand(new HtmlCommand('#custom-form-result', "invalid otp"));
        }
        return $response;

    }



    /**
   * {@inheritdoc}
   */
    public function submitForm(array &$form, FormStateInterface $form_state) {
        // Display result.
        // Load the user entity by username
        //        $phone = $form_state->getValue('phone');
        //        $load_user = \Drupal::entityTypeManager()
        //            ->getStorage('user')
        //            ->loadByProperties(['field_phone' => '+966515656563']);
        //
        //        if (!empty($load_user)) {
        //            $user = reset($load_user);
        //            // Set the current user to the loaded user
        //            \Drupal::currentUser()->setAccount($user);
        //
        //            // Log in the user
        //            user_login_finalize($user);
        //
        //            // Optionally, perform additional actions after user login
        //
        //            // Redirect the user to a specific path
        //            $response = new RedirectResponse('https://4m.sa/invoice/user');
        //            $response->send();
        //
        //            // Or display a success message
        //            //            drupal_set_message('Logged in successfully');
        //        }
        //        else {
        //            // User not found
        //            //            drupal_set_message('User not found');
        //        }
        //
    }
}
