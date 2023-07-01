<?php

namespace Drupal\tappay\Controller;

use Drupal;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Access\AccessException;
use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\commerce_payment\Exception\PaymentGatewayException;
use Drupal\commerce_payment\Controller\PaymentCheckoutController;
use Drupal\commerce_payment\Plugin\Commerce\PaymentGateway\OffsitePaymentGatewayInterface;
use Drupal\Core\Url;
use Exception;
use Drupal\commerce_order\Entity\OrderInterface;
use Laminas\Diactoros\Response\RedirectResponse;
// Require the Tap Payments library
//require_once DRUPAL_ROOT . '/vendor/autoload.php';
use TapPayments\GoSell;

/**
 * Returns responses for Jetpay Payment Gateway routes.
 */
class TappayController extends PaymentCheckoutController
{
    use StringTranslationTrait;

    /**
     * Provides the "return" checkout payment page.
     *
     * Redirects to the next checkout page, completing checkout.
     *
     * @param \Symfony\Component\HttpFoundation\Request $request
     *   The request.
     * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
     *   The route match.
     */
    public function returnPage(Request $request, RouteMatchInterface $route_match) {

        /** @var \Drupal\commerce_order\Entity\OrderInterface $order */
        $order = $route_match->getParameter('commerce_order');
        $order_price = $order->get("total_price")->getValue()[0];
        $payload = $request->request->all();

        /** @var \Drupal\commerce_payment\Entity\PaymentGatewayInterface $payment_gateway */
        $payment_gateway = $order->get('payment_gateway')->entity;
        $payment_gateway_plugin = $payment_gateway->getPlugin();

        if (!$payment_gateway_plugin instanceof OffsitePaymentGatewayInterface) {
            throw new AccessException('The payment gateway for the order does not implement ' . OffsitePaymentGatewayInterface::class);
        }

        // Save the payment entity.
        $payment_storage = \Drupal::entityTypeManager()->getStorage('commerce_payment');
        $payment = $payment_storage->create([
            'state' => 'authorization',
            'amount' => $order->getTotalPrice(),
            'payment_gateway' => $payment_gateway->id(),
            'order_id' => $order->id(),
            'remote_id' => $remoteIP,
            'remote_state' => 'completed',
        ]);
        $payment->save();
        // Update the payment state to "completed".
        $payment->setState('completed');
        $payment->save();

        $checkout_flow = $order->get('checkout_flow')->entity;
        $checkout_flow_plugin = $checkout_flow->getPlugin();
        $step_id = $route_match->getParameter('step');
        $redirect_step_id = $checkout_flow_plugin->getNextStepId($step_id);
        // Get the URL of the next checkout step.
        $redirect_url = \Drupal\Core\Url::fromRoute('commerce_checkout.form', [
            'commerce_order' => $order->id(),
            'step' => $redirect_step_id,
        ], ['absolute' => TRUE]);

        \Drupal::messenger()->addStatus('You have successful activated your plane.');
        // Create a RedirectResponse object to perform the redirection.
        $response = new RedirectResponse($redirect_url->toString());
        return $response;

    }

    public function access() {
        // Early exit for users without checkout permission.
        if (!\Drupal::currentUser()->hasPermission('access checkout')) {
            return AccessResult::forbidden();
        }
        return AccessResult::allowed();
    }
}
