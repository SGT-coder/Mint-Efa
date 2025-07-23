from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'department', 'is_active_user', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'avatar', 'bio', 'timezone', 'language', 'notifications_enabled']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            try:
                user_obj = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials.')
            user = authenticate(username=user_obj.username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Invalid credentials.')
        else:
            raise serializers.ValidationError('Must include email and password.')
        
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'role', 'phone', 'department']
    
    def to_internal_value(self, data):
        # Use email as username if username is not provided
        if not data.get('username'):
            data['username'] = data.get('email', '')
        # Set password_confirm to password if not provided
        if not data.get('password_confirm'):
            data['password_confirm'] = data.get('password', '')
        # Ignore extra fields like company
        data = {k: v for k, v in data.items() if k in self.Meta.fields}
        return super().to_internal_value(data)
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user
