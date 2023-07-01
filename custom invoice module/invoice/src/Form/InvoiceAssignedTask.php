<?php

namespace Drupal\invoice\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\InvokeCommand;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Class InvoiceAssignedTask.
 */
class InvoiceAssignedTask extends FormBase {

    /**
   * {@inheritdoc}
   */
    public function getFormId() {
        return 'invoice_assigned_task';
    }

    /**
   * {@inheritdoc}
   */
    public function buildForm(array $form, FormStateInterface $form_state) {

        $form['description'] = [
            '#type' => 'item',
            '#markup' => $this->t('**********'),
        ];

        $currentUserAccount = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
        $current_user_id = $currentUserAccount->id();
        $client_nodes = \Drupal::entityTypeManager()
            ->getStorage('node')
            ->loadByProperties(['type' => 'client','uid' => 1]);
        // Build the select list options array.
        if(!empty($client_nodes)){    
        $options = [];
        foreach ($client_nodes as $client_node) {
            $options[$client_node->id()] = $client_node->getTitle();
        }

        // Add the select list element to the form.
        $form['selected_client'] = [
            '#type' => 'select',
            '#title' => $this->t('Select Your Assigned client'),
            '#options' => $options,
        ];

        $form['date_time'] = [
            '#prefix' => '<div class="">',
            '#type'=> 'datetime',  
            '#title'=> 'Time: ',
            '#required'=> true,
            //            '#default_value' => date('Y-m-d'),
            '#default_value' => date('Y-m-d\TH:i:s'),
            '#weight'  => '-2',
            '#suffix' => '</div>',
        ];

        $form['date'] = [
            '#prefix' => '<div class="">',
            '#type'=> 'date',  
            '#title'=> 'Date: ',
            '#required'=> true,
            '#default_value' => date('Y-m-d'),
            '#weight'  => '-3',
            '#suffix' => '</div>',
        ];

        // Gather the number of names in the form already.
        $num_names = $form_state->get('num_names');
        // We have to ensure that there is at least one name field.
        if ($num_names === NULL) {
            $form_state->set('num_names', 1);
            $num_names = 1;
        }

        $form['#tree'] = TRUE;
        $form['names_fieldset'] = [
            '#type' => 'fieldset',
            '#title' => $this->t('Add new Items'),
            '#prefix' => '<div id="names-fieldset-wrapper">',
            '#suffix' => '</div>',
        ];

        for ($i = 0; $i < $num_names; $i++) {
            $form['names_fieldset'][$i]['description'] = [
                '#type' => 'textfield',
                '#title' => $this->t('Description'),
            ];
            $form['names_fieldset'][$i]['price'] = [
                '#type' => 'textfield',
                '#title' => $this->t('Price'),
            ];
            $form['names_fieldset'][$i]['quantity'] = [
                '#type' => 'textfield',
                '#title' => $this->t('Quantity'),
            ];
            $form['names_fieldset'][$i]['discount'] = [
                '#type' => 'textfield',
                '#title' => $this->t('Discount'),
            ];
        }

        $form['names_fieldset']['actions'] = [
            '#type' => 'actions',
        ];
        $form['names_fieldset']['actions']['add_name'] = [
            '#type' => 'submit',
            '#value' => $this->t('Add one more item'),
            '#submit' => ['::addOne'],
            '#ajax' => [
                'callback' => '::addmoreCallback',
                'wrapper' => 'names-fieldset-wrapper',
            ],
        ];
        // If there is more than one name, add the remove button.
        if ($num_names > 1) {
            $form['names_fieldset']['actions']['remove_name'] = [
                '#type' => 'submit',
                '#value' => $this->t('Remove one'),
                '#submit' => ['::removeCallback'],
                '#ajax' => [
                    'callback' => '::addmoreCallback',
                    'wrapper' => 'names-fieldset-wrapper',
                ],
            ];
        }

        $form['actions']['submit'] = [
            '#type' => 'submit',
            '#value' => $this->t('Submit'),
        ];

            }else{
            
          $form['message'] = [
            '#type' => 'item',
            '#markup' => $this->t("You don't have any tasks assigned yet.")
        ];
        }
        return $form;
    }




    /**
 * Submit callback for adding one more name field.
 */
    public function addOne(array &$form, FormStateInterface $form_state) {
        $num_names = $form_state->get('num_names');
        $form_state->set('num_names', $num_names + 1);
        $form_state->setRebuild();
    }
    /**
 * Submit callback for removing one name field.
 */
    public function removeCallback(array &$form, FormStateInterface $form_state) {
        $num_names = $form_state->get('num_names');
        if ($num_names > 1) {
            $form_state->set('num_names', $num_names - 1);
        }
        $form_state->setRebuild();
    }
    /**
 * Ajax callback for adding/removing name fields.
 */
    public function addmoreCallback(array &$form, FormStateInterface $form_state) {
        return $form['names_fieldset'];
    }



    /**
 * {@inheritdoc}
 */
    public function submitForm(array &$form, FormStateInterface $form_state) {
        $client_node_id = $form_state->getValue('selected_client');
        $date_time = $form_state->getValue('date_time')->getPhpDateTime();
        $date_only = $form_state->getValue('date');        
        $dateTime = $date_time->format('Y-m-d\TH:i:s');
        $get_items = $form_state->getValue('names_fieldset');
        $node = Node::load($client_node_id);
        // Get the author of the node.
        $client_node_uid = $node->getOwner()->id();
        //$paragraph =[];
        foreach($get_items as $item_values)
        {

            unset($item_values['add_name']);    
            unset($item_values['remove_name']);    
            // Remove elements with empty value or 0
            if (empty($item_values)) {unset($item_values);} 
            if($item_values != null){
                // Create a paragraph entity.
                $paragraph[] = Paragraph::create([
                    'type' => 'add_more_invoice', // Machine name of the paragraph bundle.
                    'field_work_description' => [
                        'value' => $item_values['description'],
                    ],
                    'field_discount' => [
                        'value' => $item_values['discount'],
                    ],
                    'field_price' => [
                        'value' => $item_values['price'],
                    ],
                    'field_qty' => [
                        'value' => $item_values['quantity'],
                    ],

                ]);
            }
        }

        global $base_url;
        $current_user = \Drupal::currentUser();
        $supplier_current_name = $current_user->getAccountName();
        //        $current_sup_three_letters =         substr($supplier_current_name, 0, 3);
        $current_sup_three_letters = strtoupper(substr($supplier_current_name, 0, 3));
        //        // Get the entity type manager
        $entityTypeManager = \Drupal::entityTypeManager();
        //        // Load the storage for the 'node' entity type
        $nodeStorage = $entityTypeManager->getStorage('node');
        //        // Query the last node of the 'invoice' content type
        $query = $nodeStorage->getQuery()
            ->condition('type', 'invoice')
            ->sort('created', 'DESC')
            ->range(0, 1);
        $invoiceNids = $query->execute();
        //        // Load the last 'invoice' node
        $lastInvoiceNode = reset($invoiceNids) ? $nodeStorage->load(reset($invoiceNids)) : NULL;
        $new_invoice_nid = $lastInvoiceNode->id();
        $qr_code_url = $base_url."node/".$new_invoice_nid+1;
        $lastInvoiceNumber = $lastInvoiceNode ? $lastInvoiceNode->getTitle() : NULL;
        //        // Increment the numeric part by one
        $nextInvoiceNumber = $supplier_short_name .' - '. ($numericPart + 1);
        $get_invoice_number = explode("-", $lastInvoiceNumber);
        $get_invoice_number = trim($get_invoice_number[2]);
        $nextInvoiceNumber = (int)$get_invoice_number+1;

        //        // Create a new node entity.
        $node = Node::create([
            'type' => 'invoice', 
            'title' => "INV-$current_sup_three_letters-$nextInvoiceNumber", 
            'field_date_time' =>$dateTime,
            'field_date_only' =>$date_only,
            'field_select_client_or_add_new' =>$client_node_id,
            'field_qr_code' =>$qr_code_url,
            'uid' =>$client_node_uid,
            'field_add_more' => $paragraph, 
        ])->save();
           
        kint("data inserted successfully");
        exit;

    }


}
