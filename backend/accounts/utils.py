from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_welcome_email(user):
    """Send welcome email to newly registered user"""
    if not settings.NOTIFICATION_EMAIL_ENABLED:
        return
    
    subject = 'Welcome to FoodShare - Let\'s Fight Food Waste Together!'
    
    html_message = render_to_string('emails/welcome.html', {
        'user': user,
        'role_description': get_role_description(user.role)
    })
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Welcome email sent to {user.email}")
    except Exception as e:
        print(f"Failed to send welcome email to {user.email}: {str(e)}")

def send_notification_email(user, subject, template_name, context):
    """Generic function to send notification emails"""
    if not settings.NOTIFICATION_EMAIL_ENABLED:
        return
    
    context['user'] = user
    html_message = render_to_string(f'emails/{template_name}', context)
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Notification email sent to {user.email}: {subject}")
    except Exception as e:
        print(f"Failed to send notification email to {user.email}: {str(e)}")

def get_role_description(role):
    """Get description for user role"""
    descriptions = {
        'FoodProvider': 'As a Food Provider, you can list surplus food items and help reduce waste by connecting with NGOs and volunteers.',
        'NGO/Volunteer': 'As an NGO/Volunteer, you can browse available food items and request them for your organization or community.',
        'Admin': 'As an Admin, you have full access to manage all food listings, requests, and users on the platform.'
    }
    return descriptions.get(role, 'Welcome to FoodShare!')