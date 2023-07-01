<?php

namespace Drupal\tappay\PluginForm\TapPay;

use Drupal\commerce_payment\PluginForm\PaymentOffsiteForm as BasePaymentOffsiteForm;
use Drupal\Core\Form\FormStateInterface;
use Drupal\commerce_price\Entity\Currency;
use Drupal\Core\StringTranslation\StringTranslationTrait;
//use Symfony\Component\HttpFoundation\RedirectResponse;
use Laminas\Diactoros\Response\RedirectResponse;
use Drupal\Core\Url;
use TapPayments\GoSell;

class PaymentOffsiteForm extends BasePaymentOffsiteForm {

    use StringTranslationTrait;

    /**
   * {@inheritdoc}
   */
    public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
        global $base_url;

        $current_path = \Drupal::request()->getUri();
        $form = parent::buildConfigurationForm($form, $form_state);
        $payment = $this->entity;
        $payment_gateway_plugin = $payment->getPaymentGateway()->getPlugin();
        $configuration = $payment_gateway_plugin->getConfiguration();
        $payment_api_key = $configuration['api_key'];
    
        $order = $payment->getOrder();
        $order_price = $order->get("total_price")->getValue()[0];
        $currency = Currency::load($order_price['currency_code']);
        $symbol = $currency->get('symbol');
        $id = $order->id();
        $address = $order->getBillingProfile()->address->first();
        $billing_profile = $order->getBillingProfile();

        if ($billing_profile) {
            $first_name = $billing_profile->get('address')->given_name;
            $last_name = $billing_profile->get('address')->family_name;
            $contact_email = $order->get('mail')->value;

        }

        $return_url = \Drupal\Core\Url::fromRoute('tappay.on_return', ['commerce_order' => $id, 'step' => 'payment'], ['absolute' => TRUE])->toString();

        GoSell::setPrivateKey($payment_api_key);
        $charge = GoSell\Charges::create(
            [
                "amount"=> $order_price['number'],
                "currency"=> $order_price['currency_code'],
                "threeDSecure"=> true,
                "save_card"=> false,
                "description"=> "",
                "statement_descriptor"=> "",
                "customer"=> [
                    "first_name"=> $first_name,
                    "middle_name"=> "",
                    "last_name"=> "$last_name",
                    "email"=> $contact_email,
                    "phone"=> [
                        "country_code"=> "965",
                        "number"=> "597483773"
                    ]
                ],
                "source"=> [
                    "id"=> "src_all",
                    "details" => [
                        "card"=> [
                            "number"=> "5123450000000008",
                            "exp_month"=> "01",
                            "exp_year"=> '39',
                            "cvc"=> '100'
                        ]
                    ]
                ],
                "post"=> [
                    "url"=> "",
                ],
                "redirect"=> [
                    "url"=> $return_url,
                ]
            ]
        );

        if($charge->response->message =='Initiated'){
            $redirectUrl = $charge->transaction->url;
            header("Location: $redirectUrl");
            //            $response = new RedirectResponse($redirectUrl);
            //            return $response;
            //            kint($redirectUrl);
            exit;

        }else{
            \Drupal::messenger()->addError('Payment is not working!');
            //            $response = new RedirectResponse($current_path);
            //            return $response;

        }
    }
}