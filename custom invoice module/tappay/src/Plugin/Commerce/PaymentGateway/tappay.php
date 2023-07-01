<?php

namespace Drupal\tappay\Plugin\Commerce\PaymentGateway;

use Drupal\commerce_payment\PaymentMethodTypeManager;
use Drupal\commerce_payment\PaymentTypeManager;
use Drupal\commerce_payment\Entity\PaymentInterface;
use Drupal\commerce_payment\Plugin\Commerce\PaymentGateway\OffsitePaymentGatewayBase;
use Drupal\commerce_price\MinorUnitsConverterInterface;
use Drupal\commerce_price\Price;
use Drupal\Component\Datetime\TimeInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\HttpFoundation\Request;
use Drupal\commerce_order\Entity\OrderInterface;

/**
 * Provides the Off-site payment gateway.
 *
 * @CommercePaymentGateway(
 *   id = "tappay",
 *   label = "Tap Payment",
 *   display_label = "Tap Payment",
 *   forms = {
 *     "offsite-payment" = "Drupal\tappay\PluginForm\TapPay\PaymentOffsiteForm",
 *   },
 *   requires_billing_information = FALSE,
 * )
 */
class tappay extends OffsitePaymentGatewayBase implements TapPayInterface
{

  /**
   * {@inheritdoc}
   */
    public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager, PaymentTypeManager $payment_type_manager, PaymentMethodTypeManager $payment_method_type_manager, TimeInterface $time, MinorUnitsConverterInterface $minor_units_converter) {
        parent::__construct($configuration, $plugin_id, $plugin_definition, $entity_type_manager, $payment_type_manager, $payment_method_type_manager, $time, $minor_units_converter);

        // You can create an instance of the SDK here and assign it to $this->api.
        // Or inject Guzzle when there's no suitable SDK.
    }

    /**
     * {@inheritdoc}
     */
    public function defaultConfiguration() {
        return [
            'api_key' => '',
        ] + parent::defaultConfiguration();
    }

    /**
     * {@inheritdoc}
     */
    public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
        $form = parent::buildConfigurationForm($form, $form_state);

        // Example credential. Also needs matching schema in
        // config/schema/$your_module.schema.yml.
        $form['api_key'] = [
            '#type' => 'textfield',
            '#title' => $this->t('API key'),
            '#default_value' => $this->configuration['api_key'],
            '#required' => true,
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
        parent::submitConfigurationForm($form, $form_state);

        if (!$form_state->getErrors()) {
            $values = $form_state->getValue($form['#parents']);
            $this->configuration['api_key'] = $values['api_key'];
        }
    }

    /**
     * {@inheritdoc}
     */
    public function onNotify(Request $request) {
//        kint("on nofiy function");
//        exit;
    }

    /**
     * {@inheritdoc}
     */
    public function onReturn(OrderInterface $order, Request $request) {
//        kint("on onReturn function");
       
    }

    /**
     * {@inheritdoc}
     */
    public function refundPayment(PaymentInterface $payment, Price $amount = null) {
//         kint("on refundPayment function");
//        exit;
    }


}
