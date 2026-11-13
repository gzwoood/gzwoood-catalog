(function () {
  'use strict';

  var EMAIL = 'timwu@gzwoood.com';

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function fieldLabel(field) {
    var label = '';
    if (field.id) {
      var explicit = field.form && field.form.querySelector('label[for="' + CSS.escape(field.id) + '"]');
      if (explicit) label = clean(explicit.textContent).replace(/\s*\*$/, '');
    }
    return label || field.getAttribute('aria-label') || field.name || field.placeholder || field.id || 'Project detail';
  }

  function fieldValue(field) {
    if (field.type === 'checkbox' || field.type === 'radio') {
      return field.checked ? (field.value || 'Yes') : '';
    }
    if (field.tagName === 'SELECT') {
      return field.selectedIndex >= 0 ? clean(field.options[field.selectedIndex].textContent) : '';
    }
    return clean(field.value);
  }

  function buildEmail(form) {
    var rows = [];
    var seen = Object.create(null);
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      if (field.disabled || /^(submit|button|hidden|file)$/i.test(field.type || '')) return;
      var value = fieldValue(field);
      if (!value) return;
      var label = clean(fieldLabel(field));
      var key = label + '\u0000' + value;
      if (seen[key]) return;
      seen[key] = true;
      rows.push(label + ': ' + value);
    });

    var title = clean(document.querySelector('h1') && document.querySelector('h1').textContent) || clean(document.title);
    var subject = 'Custom packaging inquiry' + (title ? ' - ' + title : '');
    var body = [
      'Hello GZ Woood Packaging,',
      '',
      'I would like a quotation and packaging recommendation.',
      '',
      rows.length ? rows.join('\n') : 'Please contact me about this packaging project.',
      '',
      'Page: ' + window.location.href
    ].join('\n');

    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function enhance(form, index) {
    if (form.dataset.dualInquiryReady === 'true') return;
    var submit = form.querySelector('button[type="submit"], input[type="submit"]');
    if (!submit) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'dual-inquiry-actions';
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-label', 'Choose how to send your inquiry');

    submit.parentNode.insertBefore(wrapper, submit);
    wrapper.appendChild(submit);
    submit.textContent = 'Send via WhatsApp';
    submit.setAttribute('aria-label', 'Send inquiry via WhatsApp');

    var emailButton = document.createElement('button');
    emailButton.type = 'button';
    emailButton.className = 'dual-inquiry-email';
    emailButton.textContent = 'Send by Email';
    emailButton.setAttribute('aria-label', 'Send inquiry by email');
    emailButton.dataset.formIndex = String(index);
    emailButton.addEventListener('click', function () {
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      window.location.href = buildEmail(form);
    });
    wrapper.appendChild(emailButton);

    var note = document.createElement('p');
    note.className = 'dual-inquiry-note';
    note.textContent = 'Both options include the project details entered above. You can review the message before sending.';
    wrapper.insertAdjacentElement('afterend', note);
    form.dataset.dualInquiryReady = 'true';
  }

  function init() {
    document.querySelectorAll('form').forEach(enhance);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
